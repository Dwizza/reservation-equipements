<?php

namespace App\Http\Requests\Reservation;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->check();
    }

    public function rules(): array
    {
        return [
            'equipment_id' => ['required', 'integer', 'exists:equipment,id'],
            'start_date' => ['required', 'date', 'date_format:Y-m-d H:i:s'],
            'end_date' => ['required', 'date', 'date_format:Y-m-d H:i:s', 'after:start_date'],
        ];
    }
}
