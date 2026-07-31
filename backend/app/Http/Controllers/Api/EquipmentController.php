<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Equipment\UpdateEquipmentRequest;
use App\Http\Resources\EquipmentResource;
use App\Services\EquipmentService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class EquipmentController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('admin', only: ['store', 'update', 'destroy']),
        ];
    }
    protected $equipmentService;

    public function __construct(EquipmentService $equipmentService)
    {
        $this->equipmentService = $equipmentService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category']);
        $equipments = $this->equipmentService->getAllEquipments($filters);
        
        return EquipmentResource::collection($equipments);
    }

    public function store(StoreEquipmentRequest $request)
    {
        $equipment = $this->equipmentService->createEquipment($request->validated());
        
        return response()->json([
            'message' => 'Equipment created successfully',
            'data' => new EquipmentResource($equipment)
        ], 201);
    }

    public function show(string $id)
    {
        $equipment = $this->equipmentService->getEquipmentById($id);
        
        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        return new EquipmentResource($equipment);
    }

    public function update(UpdateEquipmentRequest $request, string $id)
    {
        $equipment = $this->equipmentService->updateEquipment($id, $request->validated());

        if (!$equipment) {
            return response()->json(['message' => 'Equipment not found'], 404);
        }

        return response()->json([
            'message' => 'Equipment updated successfully',
            'data' => new EquipmentResource($equipment)
        ]);
    }

    public function destroy(string $id)
    {
        $deleted = $this->equipmentService->deleteEquipment($id);

        if (!$deleted) {
            return response()->json(['message' => 'Equipment not found or could not be deleted'], 404);
        }

        return response()->json(['message' => 'Equipment deleted successfully'], 200);
    }
}
