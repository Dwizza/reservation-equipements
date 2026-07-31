<?php

namespace App\Repositories\Eloquent;

use App\Models\Equipment;
use App\Repositories\Contracts\EquipmentRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EquipmentRepository implements EquipmentRepositoryInterface
{
    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Equipment::query();

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('serial_number', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Equipment
    {
        return Equipment::find($id);
    }

    public function create(array $data): Equipment
    {
        return Equipment::create($data);
    }

    public function update(Equipment $equipment, array $data): Equipment
    {
        $equipment->update($data);
        return $equipment;
    }

    public function delete(Equipment $equipment): bool
    {
        return $equipment->delete();
    }
}
