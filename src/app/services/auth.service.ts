// Serviço para gerenciar a autenticação do usuário.
// Contém lógica para verificar o status de login, simular login/logout.

import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs'; // 'of' é usado para criar um Observable que emite um valor e completa.
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // Torna o serviço disponível em toda a aplicação
})
export class AuthService {
  // Injeta o Router para navegação programática.
  private router = inject(Router);

  /**
   * Verifica se o usuário está autenticado.
   * No ambiente real, isso geralmente envolve verificar a presença e a validade de um token JWT
   * armazenado no localStorage ou em cookies.
   * @returns `true` se o usuário estiver autenticado, `false` caso contrário.
   */
  isAuthenticated(): boolean {
    // Lógica real: verifica a existência de um token JWT (ex: 'jwt_token') no localStorage.
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('jwt_token') : null;
    // Em uma aplicação real, você também verificaria a expiração do token e outras validações.
    return !!token; // Retorna true se o token existe e não é nulo/vazio.
  }

  /**
   * Simula um processo de login.
   * Em uma aplicação real, faria uma chamada POST para um endpoint de login do backend.
   * @param username O nome de usuário.
   * @param password A senha.
   * @returns Um Observable<boolean> indicando o sucesso ou falha do login.
   */
  login(username: string, password: string): Observable<boolean> {
    // **Este é um exemplo SIMULADO. Substitua por uma chamada real à API de autenticação.**
    // Exemplo de chamada real:
    // return this.http.post<AuthResponse>('auth/login', { username, password }).pipe(
    //   tap(response => localStorage.setItem('jwt_token', response.token)),
    //   map(() => true),
    //   catchError(error => { /* tratar erro */ return of(false); })
    // );

    if (username === 'user' && password === 'password') {
      // Simula o armazenamento de um token após um login bem-sucedido.
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('jwt_token', 'fake-jwt-token-from-backend');
      }
      return of(true); // Login bem-sucedido
    }
    return of(false); // Login falhou
  }

  /**
   * Realiza o logout do usuário.
   * Remove o token de autenticação e redireciona para a tela de login.
   */
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('jwt_token'); // Remove o token do armazenamento local.
    }
    this.router.navigate(['/login']); // Redireciona para a página de login.
  }
}