// Define a interface para a entidade VehicleModel (Modelo de Veículo).
// Corresponde ao modelo VehicleModel.java do backend.

export interface VehicleModel {
    id?: string;          // ID único do modelo de veículo (UUID no backend, string no frontend). Opcional para criação.
    name: string;         // Nome do modelo (ex: "Focus"). Obrigatório.
    manufacturer: string; // Fabricante do veículo (ex: "Ford"). Obrigatório.
    year?: number;        // Ano do modelo de veículo. Opcional.
    description?: string; // Descrição adicional do modelo. Opcional.
  }