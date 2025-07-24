// src/app/features/parts/models/part-vehicle-compatibility.model.ts
// Define a interface para a entidade PartVehicleCompatibility (Compatibilidade Peça-Veículo).
// Corresponde ao modelo PartVehicleCompatibility.java do backend.

import { Part } from './part.model';               // Importa a interface Part
import { VehicleModel } from '../../vehicle-models/models/vehicle-model.model';

export interface PartVehicleCompatibility {
  id?: string;             // ID único da compatibilidade (UUID no backend, string no frontend). Opcional para criação.
  part: Part;              // A peça envolvida na compatibilidade (relação ManyToOne).
  vehicleModel: VehicleModel; // O modelo de veículo envolvido na compatibilidade (relação ManyToOne).
  notes?: string;          // Notas adicionais sobre a compatibilidade. Opcional.
}