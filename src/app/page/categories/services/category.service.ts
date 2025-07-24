// src/app/features/categories/services/category.service.ts
// Serviço específico para a entidade Category (Categoria).
// Utiliza o ApiService genérico para realizar operações CRUD com o endpoint de categorias.

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Category } from '../models/categories.model';
import { PageResponse, PaginationParams } from '../../../shared/models/pagination.model';


@Injectable({
  providedIn: 'root' // Torna o serviço um singleton e disponível em toda a aplicação
})
export class CategoryService {
  // Injeta o ApiService para fazer as requisições HTTP.
  private apiService = inject(ApiService);
  // Define o caminho do recurso para o endpoint de categorias na API.
  private resourcePath = 'categories';

  /**
   * Obtém todas as categorias com suporte a paginação.
   * @param params (Opcional) Parâmetros de paginação e ordenação.
   * @returns Um Observable de PageResponse contendo uma lista de categorias.
   */
  getAllCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>(this.resourcePath);
  }

  /**
   * Obtém uma categoria específica pelo seu ID.
   * @param id O ID da categoria a ser recuperada.
   * @returns Um Observable da categoria encontrada.
   */
  getCategoryById(id: string): Observable<Category> {
    return this.apiService.get<Category>(this.resourcePath, id);
  }

  /**
   * Cria uma nova categoria.
   * @param category O objeto Category a ser criado.
   * @returns Um Observable da categoria criada pelo backend.
   */
  createCategory(category: Category): Observable<Category> {
    return this.apiService.post<Category>(this.resourcePath, category);
  }

  /**
   * Atualiza uma categoria existente.
   * @param id O ID da categoria a ser atualizada.
   * @param category O objeto Category com os dados atualizados.
   * @returns Um Observable da categoria atualizada pelo backend.
   */
  updateCategory(id: string, category: Category): Observable<Category> {
    return this.apiService.put<Category>(this.resourcePath, id, category);
  }

  /**
   * Deleta uma categoria pelo seu ID.
   * @param id O ID da categoria a ser deletada.
   * @returns Um Observable para a operação de exclusão (geralmente `void`).
   */
  deleteCategory(id: string): Observable<void> {
    return this.apiService.delete<void>(this.resourcePath, id);
  }
}