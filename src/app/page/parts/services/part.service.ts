// src/app/features/parts/services/part.service.ts
// Serviço específico para a entidade Part (Peça).
// Gerencia operações CRUD para peças e suas compatibilidades com modelos de veículos.

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Part } from '../models/part.model'; // Importa a interface Part
import { ApiService } from '../../../services/api.service'; // Importa o ApiService genérico
import { PageResponse, PaginationParams } from '../../../shared/models/pagination.model'; // Importa modelos de paginação
import { PartVehicleCompatibility } from '../models/part-vehicle-compatibility.model'; // Importa a interface de compatibilidade

@Injectable({
  providedIn: 'root' // Torna o serviço um singleton e disponível em toda a aplicação
})
export class PartService {
  // Injeta o ApiService.
  private apiService = inject(ApiService);
  // Define o caminho do recurso para o endpoint de peças na API.
  private resourcePath = 'parts';

  /**
   * Obtém todas as peças com suporte a paginação.
   * @param params (Opcional) Parâmetros de paginação e ordenação.
   * @returns Um Observable de PageResponse contendo uma lista de peças.
   */
  getAllParts(params?: PaginationParams): Observable<PageResponse<Part>> {
    return this.apiService.getPaginated<Part>(this.resourcePath, params);
  }

  /**
   * Obtém uma peça específica pelo seu ID.
   * @param id O ID da peça a ser recuperada.
   * @returns Um Observable da peça encontrada.
   */
  getPartById(id: string): Observable<Part> {
    return this.apiService.get<Part>(this.resourcePath, id);
  }

  /**
   * Cria uma nova peça.
   * @param part O objeto Part a ser criado.
   * @returns Um Observable da peça criada pelo backend.
   */
  createPart(part: Part): Observable<Part> {
    // Nota: Se o backend esperar apenas o ID da categoria, ajuste `part.category` para `part.category.id`
    const partToSend = {
        ...part,
        categoryId: part.category?.id // Assume que o backend espera categoryId no DTO de criação/atualização
    };
    return this.apiService.post<Part>(this.resourcePath, partToSend);
  }

  /**
   * Atualiza uma peça existente.
   * @param id O ID da peça a ser atualizada.
   * @param part O objeto Part com os dados atualizados.
   * @returns Um Observable da peça atualizada pelo backend.
   */
  updatePart(id: string, part: Part): Observable<Part> {
    // Nota: Se o backend esperar apenas o ID da categoria, ajuste `part.category` para `part.category.id`
    const partToSend = {
        ...part,
        categoryId: part.category?.id // Assume que o backend espera categoryId no DTO de criação/atualização
    };
    return this.apiService.put<Part>(this.resourcePath, id, partToSend);
  }

  /**
   * Deleta uma peça pelo seu ID.
   * @param id O ID da peça a ser deletada.
   * @returns Um Observable para a operação de exclusão.
   */
  deletePart(id: string): Observable<void> {
    return this.apiService.delete<void>(this.resourcePath, id);
  }

  /**
   * Obtém as compatibilidades de um peça específica com modelos de veículos, com paginação.
   * @param partId O ID da peça.
   * @param params (Opcional) Parâmetros de paginação e ordenação.
   * @returns Um Observable de PageResponse contendo uma lista de PartVehicleCompatibility.
   */
  getPartCompatibilities(partId: string): Observable<any> {
    return this.apiService.getPaginated<any>(`${this.resourcePath}/${partId}`);
  }

  /**
   * Adiciona uma nova compatibilidade para uma peça específica.
   * @param partId O ID da peça.
   * @param vehicleModelId O ID do modelo de veículo a ser associado.
   * @param notes (Opcional) Notas sobre a compatibilidade.
   * @returns Um Observable da PartVehicleCompatibility criada.
   */
  addPartCompatibility(partId: string, vehicleModelId: string, notes?: string): Observable<PartVehicleCompatibility> {
    const body = { partId, vehicleModelId, notes };
    return this.apiService.post<PartVehicleCompatibility>('parts/vehicle-compatibility', body);
  }

  /**
   * Deleta uma compatibilidade específica de uma peça.
   * @param partId O ID da peça.
   * @param compatibilityId O ID da compatibilidade a ser deletada.
   * @returns Um Observable para a operação de exclusão.
   */
  deletePartCompatibility(partId: string, compatibilityId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.resourcePath}/${partId}/compatibilities`, compatibilityId);
  }
}