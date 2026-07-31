<?php

namespace App\Services;

use App\Models\Equipment;
use App\Models\Reservation;
use App\Repositories\Contracts\EquipmentRepositoryInterface;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use Exception;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    protected $reservationRepository;
    protected $equipmentRepository;

    public function __construct(
        ReservationRepositoryInterface $reservationRepository,
        EquipmentRepositoryInterface $equipmentRepository
    ) {
        $this->reservationRepository = $reservationRepository;
        $this->equipmentRepository = $equipmentRepository;
    }

    public function getAllReservations(array $filters = [])
    {
        return $this->reservationRepository->getAll($filters);
    }

    public function getUserReservations(int $userId, array $filters = [])
    {
        return $this->reservationRepository->getUserReservations($userId, $filters);
    }

    public function getReservationById(int $id)
    {
        return $this->reservationRepository->findById($id);
    }

    /**
     * @throws ValidationException
     */
    public function createReservation(array $data)
    {
        $this->validateBusinessRules($data['equipment_id'], $data['start_date'], $data['end_date']);

        $data['status'] = Reservation::STATUS_PENDING;

        return $this->reservationRepository->create($data);
    }

    /**
     * @throws ValidationException
     * @throws Exception
     */
    public function updateReservation(int $id, array $data, $user)
    {
        $reservation = $this->reservationRepository->findById($id);

        if (!$reservation) {
            throw new Exception("Reservation not found", 404);
        }

        // Rule: A returned reservation cannot be modified
        if ($reservation->status === Reservation::STATUS_RETURNED) {
            throw ValidationException::withMessages([
                'status' => 'Une réservation restituée ne peut plus être modifiée.'
            ]);
        }

        // Rule: A normal user can only update their own reservation and only if it is pending
        if (!$user->isAdmin()) {
            if ($reservation->user_id !== $user->id) {
                throw new Exception("Unauthorized", 403);
            }
            if ($reservation->status !== Reservation::STATUS_PENDING) {
                throw ValidationException::withMessages([
                    'status' => 'Vous ne pouvez modifier qu\'une réservation en attente.'
                ]);
            }
            
            // User cannot change status
            unset($data['status']);
        }

        // If dates or equipment are being updated, we need to validate overlapping and availability
        $equipmentId = $data['equipment_id'] ?? $reservation->equipment_id;
        $startDate = $data['start_date'] ?? $reservation->start_date->toDateTimeString();
        $endDate = $data['end_date'] ?? $reservation->end_date->toDateTimeString();

        if (isset($data['start_date']) || isset($data['end_date']) || isset($data['equipment_id'])) {
            $this->validateBusinessRules($equipmentId, $startDate, $endDate, $reservation->id);
        }

        $updatedReservation = $this->reservationRepository->update($reservation, $data);

        // Auto-sync Equipment Status
        if (isset($data['status'])) {
            $equipment = $this->equipmentRepository->findById($updatedReservation->equipment_id);
            if ($equipment) {
                if ($data['status'] === Reservation::STATUS_APPROVED) {
                    $this->equipmentRepository->update($equipment, ['status' => Equipment::STATUS_RESERVE]);
                } elseif ($data['status'] === Reservation::STATUS_RETURNED) {
                    $this->equipmentRepository->update($equipment, ['status' => Equipment::STATUS_DISPONIBLE]);
                }
            }
        }

        return $updatedReservation;
    }

    public function deleteReservation(int $id, $user)
    {
        $reservation = $this->reservationRepository->findById($id);
        
        if (!$reservation) {
            return false;
        }

        // Only admin or the owner can delete
        if (!$user->isAdmin() && $reservation->user_id !== $user->id) {
            throw new Exception("Unauthorized", 403);
        }

        return $this->reservationRepository->delete($reservation);
    }

    /**
     * @throws ValidationException
     */
    private function validateBusinessRules(int $equipmentId, string $startDate, string $endDate, ?int $excludeReservationId = null): void
    {
        // Rule: End date must be after start date
        if (strtotime($endDate) <= strtotime($startDate)) {
            throw ValidationException::withMessages([
                'end_date' => 'La date de retour doit être postérieure à la date de réservation.'
            ]);
        }

        // Rule: Check if equipment exists and is not in maintenance
        $equipment = $this->equipmentRepository->findById($equipmentId);
        if (!$equipment) {
            throw ValidationException::withMessages([
                'equipment_id' => 'Équipement introuvable.'
            ]);
        }

        if ($equipment->status === Equipment::STATUS_MAINTENANCE) {
            throw ValidationException::withMessages([
                'equipment_id' => 'Cet équipement est en maintenance et ne peut pas être réservé.'
            ]);
        }

        // Rule: Check for overlapping reservations
        if (!$this->reservationRepository->isEquipmentAvailable($equipmentId, $startDate, $endDate, $excludeReservationId)) {
            throw ValidationException::withMessages([
                'equipment_id' => 'Cet équipement est déjà réservé pour ces dates.'
            ]);
        }
    }
}
