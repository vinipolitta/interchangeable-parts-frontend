// src/app/core/services/api.service.ts
// Serviço genérico para todas as chamadas à API REST.
// Utiliza HttpClient para fazer requisições e gerencia a URL base da API.

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse, PaginationParams } from '../shared/models/pagination.model';

@Injectable({
  providedIn: 'root' // Torna o serviço um singleton e disponível em toda a aplicação
})
export class ApiService {
  // Injeta o HttpClient usando a nova função `inject` do Angular.
  private http = inject(HttpClient);
  // Define a URL base da API a partir das variáveis de ambiente.
  private baseUrl = environment.apiUrl;

  /**
   * Faz uma requisição GET para um endpoint que retorna dados paginados.
   * Ideal para listar recursos com suporte a paginação, ordenação e filtros.
   * @param path O caminho do endpoint (ex: 'categories', 'parts').
   * @param params Parâmetros de paginação e ordenação (page, size, sort).
   * @returns Um Observable da resposta paginada (PageResponse<T>).
   */
  getPaginated<T>(path: string, params?: PaginationParams): Observable<PageResponse<T>> {
    let httpParams = new HttpParams();
    // Adiciona parâmetros de paginação e ordenação à requisição HTTP.
    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
      // Adicione aqui outros parâmetros de filtro se necessário (ex: name, description)
      if (params.name) httpParams = httpParams.set('name', params.name);
      // ... outros filtros
    }
    return this.http.get<PageResponse<T>>(`${this.baseUrl}/${path}`, { params: httpParams });
  }

  /**
   * Faz uma requisição GET para um único recurso ou uma lista não paginada.
   * @param path O caminho do endpoint (ex: 'categories').
   * @param id (Opcional) O ID do recurso, se for um GET por ID (ex: 'categories/123').
   * @param queryParams (Opcional) Parâmetros de query adicionais para a URL.
   * @returns Um Observable do tipo de dado esperado (T).
   */
  get<T>(path: string, id?: string, queryParams?: { [key: string]: string | number | boolean }): Observable<T> {
    let httpParams = new HttpParams();
    // Converte o objeto queryParams para HttpParams.
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        const value = queryParams[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}/${path}${id ? '/' + id : ''}`, { params: httpParams });
  }

  /**
   * Faz uma requisição POST para criar um novo recurso.
   * @param path O caminho do endpoint.
   * @param body O corpo da requisição com os dados do recurso a ser criado.
   * @returns Um Observable do tipo de dado esperado (T), geralmente o recurso criado.
   */
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  /**
   * Faz uma requisição PUT para atualizar um recurso existente.
   * @param path O caminho do endpoint.
   * @param id O ID do recurso a ser atualizado.
   * @param body O corpo da requisição com os dados atualizados do recurso.
   * @returns Um Observable do tipo de dado esperado (T), geralmente o recurso atualizado.
   */
  put<T>(path: string, id: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}/${id}`, body);
  }

  /**
   * Faz uma requisição DELETE para remover um recurso.
   * @param path O caminho do endpoint.
   * @param id O ID do recurso a ser deletado.
   * @returns Um Observable para a operação de exclusão (geralmente `void` ou um objeto de status).
   */
  delete<T>(path: string, id: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}/${id}`);
  }
}