<?php

namespace App\Services;

use App\Repositories\Contracts\EquipmentRepositoryInterface;

class EquipmentService
{
    protected $equipmentRepository;

    public function __construct(EquipmentRepositoryInterface $equipmentRepository)
    {
        $this->equipmentRepository = $equipmentRepository;
    }

    public function getAllEquipments(array $filters = [])
    {
        return $this->equipmentRepository->getAll($filters);
    }

    public function getEquipmentById(int $id)
    {
        return $this->equipmentRepository->findById($id);
    }

    public function createEquipment(array $data)
    {

        return $this->equipmentRepository->create($data);
    }

    public function updateEquipment(int $id, array $data)
    {
        $equipment = $this->equipmentRepository->findById($id);
        if (!$equipment) {
            return null;
        }

        
        return $this->equipmentRepository->update($equipment, $data);
    }

    public function deleteEquipment(int $id)
    {
        $equipment = $this->equipmentRepository->findById($id);
        if (!$equipment) {
            return false;
        }
        
        return $this->equipmentRepository->delete($equipment);
    }
}
