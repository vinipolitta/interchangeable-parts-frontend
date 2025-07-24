// Define a interface para a entidade Category (Categoria).
// Corresponde ao modelo Category.java do backend.

export interface Category {
    id?: string;       // ID único da categoria (UUID no backend, string no frontend). Opcional para criação.
    name: string;      // Nome da categoria. Obrigatório.
    description?: string; // Descrição da categoria. Opcional.
  }