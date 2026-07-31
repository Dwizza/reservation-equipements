<?php

namespace App\Http\Requests\Equipment;

use App\Models\Equipment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $equipmentId = $this->route('equipment');
        
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', 'max:255'],
            'serial_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('equipment', 'serial_number')->ignore($equipmentId)],
            'status' => ['sometimes', 'required', 'string', Rule::in([Equipment::STATUS_DISPONIBLE, Equipment::STATUS_RESERVE, Equipment::STATUS_MAINTENANCE])],
        ];
    }
}
