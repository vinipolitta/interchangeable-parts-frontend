import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageResponse, PaginationParams } from '../../../../shared/models/pagination.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { VehicleModel } from '../../models/vehicle-model.model';
import { VehicleModelService } from '../../services/vehicle-model.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-vehicle-models-list',
  imports: [
    CommonModule,
    RouterLink,
    SharedModule
  ],
  templateUrl: './vehicle-models-list.html',
  styleUrl: './vehicle-models-list.css'
})
export class VehicleModelListComponent implements OnInit {
  vehicleModels: VehicleModel[] = [];
  isLoading: boolean = false;

  private vehicleModelService = inject(VehicleModelService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadVehicleModels();
    console.log('loadVehicleModels');
  }

  /**
   * Carrega os modelos de veículos do backend.
   */
  loadVehicleModels(): void {
    this.isLoading = true;
    this.vehicleModelService.getAllVehicleModels().subscribe({
      next: (response) => {
        // FIX: Garante que 'vehicleModels' é sempre um array, mesmo se 'response.content' for undefined/null
        this.vehicleModels = response ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar modelos de veículos:', err);
        this.notificationService.showError('Não foi possível carregar os modelos de veículos. Tente novamente mais tarde.');
        this.isLoading = false;
        this.vehicleModels = []; // Garante que a lista esteja vazia em caso de erro
      }
    });
  }

  /**
   * Manipula o evento de mudança de página.
   */
  // onPageChange(page: number): void {
  //   this.paginationParams.page = page - 1;
  //   this.loadVehicleModels();
  // }

  /**
   * Navega para a tela de edição de modelo de veículo.
   */
  editVehicleModel(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/vehicle-models/edit', id]);
    } else {
      this.notificationService.showWarning('ID do modelo de veículo não encontrado para edição.');
    }
  }

  /**
   * Inicia o processo de exclusão de um modelo de veículo.
   */
  deleteVehicleModel(id: string | undefined): void {
    if (!id) {
      this.notificationService.showWarning('ID do modelo de veículo não fornecido para exclusão.');
      return;
    }

    const modalRef = this.modalService.open(ConfirmDialog);
    modalRef.componentInstance.title = 'Confirmar Exclusão';
    modalRef.componentInstance.message = 'Tem certeza que deseja deletar este modelo de veículo? Esta ação não pode ser desfeita.';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.vehicleModelService.deleteVehicleModel(id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Modelo de veículo deletado com sucesso!');
            this.loadVehicleModels(); // Recarrega a lista
          },
          error: (err) => {
            console.error('Erro ao deletar modelo de veículo:', err);
          }
        });
      }
    }).catch(() => {});
  }
}