<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Http\Requests\Reservation\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Services\ReservationService;
use Exception;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    protected $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    public function index(Request $request)
    {
        $user = auth('api')->user();
        $filters = $request->only(['status']);

        // Admin sees all reservations, Normal user sees only theirs
        if ($user->isAdmin()) {
            $reservations = $this->reservationService->getAllReservations($filters);
        } else {
            $reservations = $this->reservationService->getUserReservations($user->id, $filters);
        }
        
        return ReservationResource::collection($reservations);
    }

    public function store(StoreReservationRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth('api')->id(); // Force the current user's ID

        $reservation = $this->reservationService->createReservation($data);
        
        return response()->json([
            'message' => 'Réservation créée avec succès',
            'data' => new ReservationResource($reservation)
        ], 201);
    }

    public function show(string $id)
    {
        $reservation = $this->reservationService->getReservationById($id);
        
        if (!$reservation) {
            return response()->json(['message' => 'Réservation introuvable'], 404);
        }

        $user = auth('api')->user();
        if (!$user->isAdmin() && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return new ReservationResource($reservation);
    }

    public function update(UpdateReservationRequest $request, string $id)
    {
        try {
            $reservation = $this->reservationService->updateReservation($id, $request->validated(), auth('api')->user());

            return response()->json([
                'message' => 'Réservation mise à jour avec succès',
                'data' => new ReservationResource($reservation)
            ]);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            return response()->json(['message' => $e->getMessage()], $code);
        }
    }

    public function destroy(string $id)
    {
        try {
            $deleted = $this->reservationService->deleteReservation($id, auth('api')->user());

            if (!$deleted) {
                return response()->json(['message' => 'Réservation introuvable'], 404);
            }

            return response()->json(['message' => 'Réservation supprimée avec succès'], 200);
        } catch (Exception $e) {
            $code = $e->getCode() ?: 400;
            return response()->json(['message' => $e->getMessage()], $code);
        }
    }
}
