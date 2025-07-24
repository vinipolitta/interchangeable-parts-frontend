// src/app/features/parts/models/part.model.ts
// Define a interface para a entidade Part (Peça).
// Corresponde ao modelo Part.java do backend.

import { Category } from '../../categories/models/categories.model';

export interface Part {
    id?: string;          // ID único da peça (UUID no backend, string no frontend). Opcional para criação.
    name: string;         // Nome da peça. Obrigatório.
    description?: string;  // Descrição da peça. Opcional.
    partNumber: string;   // Número de identificação da peça. Obrigatório.
    category: Category;   // Relação ManyToOne com Category. Representa a categoria à qual a peça pertence.
}