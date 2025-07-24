// src/app/features/vehicle-models/services/vehicle-model.service.ts
// Serviço específico para a entidade VehicleModel (Modelo de Veículo).
// Gerencia operações CRUD para modelos de veículos.

import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { VehicleModel } from '../models/vehicle-model.model'; // Importa a interface VehicleModel
import { ApiService } from '../../../services/api.service'; // Importa o ApiService genérico
import { PageResponse, PaginationParams } from '../../../shared/models/pagination.model'; // Importa modelos de paginação

@Injectable({
  providedIn: 'root' // Torna o serviço um singleton e disponível em toda a aplicação
})
export class VehicleModelService {
  // Injeta o ApiService.
  private apiService = inject(ApiService);
  // Define o caminho do recurso para o endpoint de modelos de veículos na API.
  private resourcePath = 'vehicle-models';

  /**
   * Obtém todos os modelos de veículos com suporte a paginação.
   * @param params (Opcional) Parâmetros de paginação e ordenação.
   * @returns Um Observable de PageResponse contendo uma lista de modelos de veículos.
   */
  getAllVehicleModels(): Observable<VehicleModel[]> {
    return this.apiService.get<VehicleModel[]>(this.resourcePath).pipe(
      map((response) => {
        console.log('response', response);
        return response;
      })
    );
  }

  /**
   * Obtém um modelo de veículo específico pelo seu ID.
   * @param id O ID do modelo de veículo a ser recuperado.
   * @returns Um Observable do modelo de veículo encontrado.
   */
  getVehicleModelById(id: string): Observable<VehicleModel> {
    return this.apiService.get<VehicleModel>(this.resourcePath, id);
  }

  /**
   * Cria um novo modelo de veículo.
   * @param model O objeto VehicleModel a ser criado.
   * @returns Um Observable do modelo de veículo criado pelo backend.
   */
  createVehicleModel(model: VehicleModel): Observable<VehicleModel> {
    return this.apiService.post<VehicleModel>(this.resourcePath, model);
  }

  /**
   * Atualiza um modelo de veículo existente.
   * @param id O ID do modelo de veículo a ser atualizado.
   * @param model O objeto VehicleModel com os dados atualizados.
   * @returns Um Observable do modelo de veículo atualizado pelo backend.
   */
  updateVehicleModel(id: string, model: VehicleModel): Observable<VehicleModel> {
    return this.apiService.put<VehicleModel>(this.resourcePath, id, model);
  }

  /**
   * Deleta um modelo de veículo pelo seu ID.
   * @param id O ID do modelo de veículo a ser deletado.
   * @returns Um Observable para a operação de exclusão.
   */
  deleteVehicleModel(id: string): Observable<void> {
    return this.apiService.delete<void>(this.resourcePath, id);
  }
}