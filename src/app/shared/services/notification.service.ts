// Serviço para exibir notificações (alertas) na interface do usuário.
// Permite que componentes enviem mensagens de sucesso, erro, info ou aviso.

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; // Subject é um tipo especial de Observable que permite multicast.

/**
 * @interface Alert
 * @description Define a estrutura de uma mensagem de alerta.
 */
export interface Alert {
  type: 'success' | 'info' | 'warning' | 'danger'; // Tipo do alerta (para styling).
  message: string;                                // Conteúdo da mensagem do alerta.
  timeout?: number;                               // Tempo em ms para o alerta desaparecer automaticamente.
}

@Injectable({
  providedIn: 'root' // Torna o serviço um singleton e disponível em toda a aplicação.
})
export class NotificationService {
  // Subject privado para emitir novas mensagens de alerta.
  private alertSubject = new Subject<Alert>();
  // Observable público que outros componentes podem subscrever para receber alertas.
  alert$ = this.alertSubject.asObservable();

  /**
   * Exibe uma mensagem de sucesso.
   * @param message A mensagem a ser exibida.
   * @param timeout (Opcional) Tempo em ms para o alerta desaparecer automaticamente. Padrão: 5000ms.
   */
  showSuccess(message: string, timeout: number = 5000): void {
    this.alertSubject.next({ type: 'success', message, timeout });
  }

  /**
   * Exibe uma mensagem de erro.
   * @param message A mensagem a ser exibida.
   * @param timeout (Opcional) Tempo em ms para o alerta desaparecer automaticamente. Padrão: 5000ms.
   */
  showError(message: string, timeout: number = 5000): void {
    this.alertSubject.next({ type: 'danger', message, timeout });
  }

  /**
   * Exibe uma mensagem informativa.
   * @param message A mensagem a ser exibida.
   * @param timeout (Opcional) Tempo em ms para o alerta desaparecer automaticamente. Padrão: 5000ms.
   */
  showInfo(message: string, timeout: number = 5000): void {
    this.alertSubject.next({ type: 'info', message, timeout });
  }

  /**
   * Exibe uma mensagem de aviso.
   * @param message A mensagem a ser exibida.
   * @param timeout (Opcional) Tempo em ms para o alerta desaparecer automaticamente. Padrão: 5000ms.
   */
  showWarning(message: string, timeout: number = 5000): void {
    this.alertSubject.next({ type: 'warning', message, timeout });
  }
}