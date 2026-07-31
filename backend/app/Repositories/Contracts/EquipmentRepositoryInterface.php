<?php

namespace App\Repositories\Contracts;

use App\Models\Equipment;
use Illuminate\Pagination\LengthAwarePaginator;

interface EquipmentRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function findById(int $id): ?Equipment;
    public function create(array $data): Equipment;
    public function update(Equipment $equipment, array $data): Equipment;
    public function delete(Equipment $equipment): bool;
}
