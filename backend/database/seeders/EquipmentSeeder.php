<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipments = [
            ['name' => 'MacBook Pro M2 14"', 'category' => 'Ordinateur', 'serial_number' => 'MAC-M2-001', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
            ['name' => 'Dell XPS 15', 'category' => 'Ordinateur', 'serial_number' => 'DELL-XPS-002', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
            ['name' => 'Lenovo ThinkPad X1', 'category' => 'Ordinateur', 'serial_number' => 'LEN-X1-003', 'status' => \App\Models\Equipment::STATUS_MAINTENANCE],
            ['name' => 'Écran Dell UltraSharp 27"', 'category' => 'Ecran', 'serial_number' => 'SCR-DEL-004', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
            ['name' => 'Écran LG 34" Ultrawide', 'category' => 'Ecran', 'serial_number' => 'SCR-LG-005', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
            ['name' => 'Vidéoprojecteur Epson', 'category' => 'Vidéoprojecteur', 'serial_number' => 'PRO-EPS-006', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
            ['name' => 'iPad Pro 11"', 'category' => 'Tablette', 'serial_number' => 'IPAD-PRO-007', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
            ['name' => 'Samsung Galaxy Tab S8', 'category' => 'Tablette', 'serial_number' => 'SAM-TAB-008', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
            ['name' => 'Clavier Logi MX Keys', 'category' => 'Accessoire', 'serial_number' => 'ACC-MXK-009', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
            ['name' => 'Souris Logi MX Master 3S', 'category' => 'Accessoire', 'serial_number' => 'ACC-MXM-010', 'status' => \App\Models\Equipment::STATUS_DISPONIBLE],
        ];

        foreach ($equipments as $eq) {
            \App\Models\Equipment::create($eq);
        }
    }
}
