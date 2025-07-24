// Interceptor HTTP para tratamento global de erros.
// Captura erros de requisições HTTP e exibe notificações ao usuário.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeta o NotificationService para exibir mensagens de erro.
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: any) => {
      let errorMessage = 'Ocorreu um erro desconhecido.'; // Mensagem de erro padrão

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente ou de rede (ex: navegador sem conexão).
        errorMessage = `Erro de rede ou cliente: ${error.error.message}`;
      } else if (error.status) {
        // Erro do lado do servidor (resposta HTTP com status de erro).
        // Constrói uma mensagem de erro mais específica com base no status HTTP.
        switch (error.status) {
          case 400: errorMessage = `Requisição Inválida (400): ${error.error?.message || error.statusText}`; break;
          case 401: errorMessage = `Não Autorizado (401): ${error.error?.message || 'Sessão expirada ou credenciais inválidas.'}`; break;
          case 403: errorMessage = `Acesso Negado (403): ${error.error?.message || 'Você não tem permissão para esta ação.'}`; break;
          case 404: errorMessage = `Recurso Não Encontrado (404): ${error.error?.message || error.statusText}`; break;
          case 409: errorMessage = `Conflito de Dados (409): ${error.error?.message || error.statusText}`; break;
          case 500: errorMessage = `Erro Interno do Servidor (500): ${error.error?.message || error.statusText}`; break;
          default: errorMessage = `Erro HTTP ${error.status}: ${error.error?.message || error.statusText}`; break;
        }
        // Tenta extrair uma mensagem de erro mais específica do corpo da resposta do backend, se disponível.
        if (error.error && typeof error.error === 'object') {
          if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.detail) { // Ex: para erros com formato Problem Details
            errorMessage = error.error.detail;
          } else if (error.error.errors) { // Ex: para erros de validação com lista de erros
              const validationErrors = Object.values(error.error.errors).flat().join('; ');
              errorMessage = `Erro de validação: ${validationErrors}`;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      // Exibe a mensagem de erro usando o NotificationService.
      notificationService.showError(errorMessage);
      // Propaga o erro para o componente que fez a requisição para que ele possa lidar com ele.
      return throwError(() => new Error(errorMessage));
    })
  );
};