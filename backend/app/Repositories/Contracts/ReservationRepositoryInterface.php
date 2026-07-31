<?php

namespace App\Repositories\Contracts;

use App\Models\Reservation;
use Illuminate\Pagination\LengthAwarePaginator;

interface ReservationRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function getUserReservations(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function findById(int $id): ?Reservation;
    public function create(array $data): Reservation;
    public function update(Reservation $reservation, array $data): Reservation;
    public function delete(Reservation $reservation): bool;
    
    /**
     * Check if an equipment is available between two dates.
     * Prevents overlap with approved or pending reservations.
     */
    public function isEquipmentAvailable(int $equipmentId, string $startDate, string $endDate, ?int $excludeReservationId = null): bool;
}
