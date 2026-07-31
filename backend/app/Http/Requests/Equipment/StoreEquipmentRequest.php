<?php

namespace App\Http\Requests\Equipment;

use App\Models\Equipment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255', 'unique:equipment,serial_number'],
            'status' => ['nullable', 'string', Rule::in([Equipment::STATUS_DISPONIBLE, Equipment::STATUS_RESERVE, Equipment::STATUS_MAINTENANCE])],
        ];
    }
}
