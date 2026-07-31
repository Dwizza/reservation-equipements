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
        $isAdmin = $user->role === 'admin';

        // Stats communes et User
        $data = [
            'equipments' => [
                'available' => Equipment::where('status', Equipment::STATUS_DISPONIBLE)->count(),
                'reserved' => Equipment::where('status', Equipment::STATUS_RESERVE)->count(),
                'maintenance' => Equipment::where('status', Equipment::STATUS_MAINTENANCE)->count(),
            ],
            'my_reservations' => [
                'count' => Reservation::where('user_id', $user->id)->count(),
                'recent' => Reservation::with('equipment')
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get()
            ]
        ];

        // Stats spécifiques à l'Admin
        if ($isAdmin) {
            $data['admin_stats'] = [
                'pending_reservations' => Reservation::where('status', 'en_attente')->count(),
                'recent_all' => Reservation::with(['equipment', 'user'])
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get()
            ];
        }

        return response()->json($data);
    }
}
