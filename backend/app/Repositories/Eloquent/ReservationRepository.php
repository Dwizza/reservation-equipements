<?php

namespace App\Repositories\Eloquent;

use App\Models\Reservation;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class ReservationRepository implements ReservationRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Reservation::with(['user', 'equipment']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function getUserReservations(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Reservation::with('equipment')->where('user_id', $userId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function findById(int $id): ?Reservation
    {
        return Reservation::with(['user', 'equipment'])->find($id);
    }

    public function create(array $data): Reservation
    {
        return Reservation::create($data);
    }

    public function update(Reservation $reservation, array $data): Reservation
    {
        $reservation->update($data);
        return $reservation;
    }

    public function delete(Reservation $reservation): bool
    {
        return $reservation->delete();
    }

    public function isEquipmentAvailable(int $equipmentId, string $startDate, string $endDate, ?int $excludeReservationId = null): bool
    {
        $query = Reservation::where('equipment_id', $equipmentId)
            ->whereIn('status', [Reservation::STATUS_PENDING, Reservation::STATUS_APPROVED])
            ->where(function ($q) use ($startDate, $endDate) {
                // Chevauchement : start1 < end2 AND end1 > start2
                $q->where('start_date', '<', $endDate)
                  ->where('end_date', '>', $startDate);
            });

        if ($excludeReservationId) {
            $query->where('id', '!=', $excludeReservationId);
        }

        return !$query->exists(); // Return true if no overlapping reservations found (i.e. available)
    }
}
