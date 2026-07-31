<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'serial_number',
        'status',
    ];

    public const STATUS_DISPONIBLE = 'Disponible';
    public const STATUS_RESERVE = 'Réservé';
    public const STATUS_MAINTENANCE = 'Maintenance';

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
