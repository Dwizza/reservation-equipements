<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Reservation;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = auth('api')->user();

        // Stats des équipements (Pour admin et info globale)
        $availableEquipments = Equipment::where('status', Equipment::STATUS_DISPONIBLE)->count();
        $reservedEquipments = Equipment::where('status', Equipment::STATUS_RESERVE)->count();
        $maintenanceEquipments = Equipment::where('status', Equipment::STATUS_MAINTENANCE)->count();

        // Mes réservations (Pour l'utilisateur connecté)
        $myReservationsCount = Reservation::where('user_id', $user->id)->count();
        
        $myRecentReservations = Reservation::with('equipment')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'equipments' => [
                'available' => $availableEquipments,
                'reserved' => $reservedEquipments,
                'maintenance' => $maintenanceEquipments,
            ],
            'my_reservations' => [
                'count' => $myReservationsCount,
                'recent' => $myRecentReservations
            ]
        ]);
    }
}
