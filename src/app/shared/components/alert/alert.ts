import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Alert as AlertModel } from '../../services/notification.service'; // Import the model/interface
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
  
@Component({
  selector: 'app-alert',
  imports: [CommonModule, NgbAlertModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: AlertModel[] = []; // Use the correct type
  private subscription: Subscription = new Subscription(); // Gerencia a subscrição
  private notificationService = inject(NotificationService); // Injeta o NotificationService

  /**
   * Método de ciclo de vida do Angular, chamado após a inicialização do componente.
   * Subscreve-se ao `alert$` do NotificationService para receber novas mensagens de alerta.
   */
  ngOnInit(): void {
    this.subscription = this.notificationService.alert$.subscribe(alert => {
      this.alerts.push(alert); // Adiciona o novo alerta à lista
      // Se um timeout for especificado, agenda a remoção automática do alerta.
      if (alert.timeout) {
        setTimeout(() => this.closeAlert(alert), alert.timeout);
      }
    });
  }

  /**
   * Remove um alerta específico da lista.
   * @param alert O alerta a ser removido.
   */
  closeAlert(alert: AlertModel) {
    this.alerts = this.alerts.filter(a => a !== alert); // Filtra o alerta para removê-lo
  }

  /**
   * Método de ciclo de vida do Angular, chamado antes da destruição do componente.
   * Desinscreve-se do Observable para evitar vazamentos de memória.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Garante que a subscrição seja fechada
  }
}