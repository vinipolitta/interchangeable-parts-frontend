// Guarda de rota para proteger rotas que exigem autenticação.
// Redireciona usuários não autenticados para a página de login.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  // Injeta o AuthService, Router e NotificationService.
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  // Verifica se o usuário está autenticado usando o AuthService.
  if (authService.isAuthenticated()) {
    return true; // Usuário autenticado, permite o acesso à rota.
  } else {
    // Usuário não autenticado.
    notificationService.showWarning('Você precisa estar logado para acessar esta página.'); // Notifica o usuário.
    router.navigate(['/login']); // Redireciona para a página de login.
    return false; // Bloqueia o acesso à rota.
  }
};