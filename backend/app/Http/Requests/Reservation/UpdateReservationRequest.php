<?php

namespace App\Http\Requests\Reservation;

use App\Models\Reservation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('api')->check();
    }

    public function rules(): array
    {
        return [
            'start_date' => ['sometimes', 'required', 'date', 'date_format:Y-m-d H:i:s'],
            'end_date' => ['sometimes', 'required', 'date', 'date_format:Y-m-d H:i:s', 'after:start_date'],
            'status' => ['sometimes', 'required', 'string', Rule::in([
                Reservation::STATUS_PENDING, 
                Reservation::STATUS_APPROVED, 
                Reservation::STATUS_REJECTED,
                Reservation::STATUS_RETURNED
            ])],
        ];
    }
}
