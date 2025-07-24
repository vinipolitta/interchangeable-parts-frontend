// src/app/core/interceptors/auth.interceptor.ts
// Interceptor HTTP para adicionar um token de autenticação (JWT) a todas as requisições de saída.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeta o AuthService para obter o token de autenticação.
  const authService = inject(AuthService);
  // Tenta obter o token JWT do localStorage. Usa um fallback para 'undefined'
  // para evitar erros durante o SSR, onde `localStorage` não existe.
  const authToken = typeof localStorage !== 'undefined' ? localStorage.getItem('jwt_token') : null;

  // Se um token for encontrado, clona a requisição e adiciona o cabeçalho 'Authorization'.
  if (authToken) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}` // Formato padrão para tokens JWT
      }
    });
    return next(clonedReq); // Passa a requisição modificada para o próximo interceptor ou backend.
  }
  // Se não houver token, passa a requisição original sem modificações.
  return next(req);
};