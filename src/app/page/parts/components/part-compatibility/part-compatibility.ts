import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { switchMap, Observable, forkJoin } from 'rxjs';
import { PageResponse, PaginationParams } from '../../../../shared/models/pagination.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { VehicleModel } from '../../../vehicle-models/models/vehicle-model.model';
import { VehicleModelService } from '../../../vehicle-models/services/vehicle-model.service';
import { PartVehicleCompatibility } from '../../models/part-vehicle-compatibility.model';
import { Part } from '../../models/part.model';
import { PartService } from '../../services/part.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-part-compatibility',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SharedModule
  ],
  templateUrl: './part-compatibility.html',
  styleUrl: './part-compatibility.css'
})
export class PartCompatibilityComponent implements OnInit {
  partId: string | null = null;
  part: Part | null = null; // Detalhes da peça atual
  compatibilities: PartVehicleCompatibility[] = []; // Compatibilidades da peça
  pageResponse: PageResponse<PartVehicleCompatibility> | null = null;
  paginationParams: PaginationParams = { page: 0, size: 10, sort: 'vehicleModel.name,asc' };

  availableVehicleModels: VehicleModel[] = []; // Modelos de veículos para o dropdown de adição
  addCompatibilityForm!: FormGroup; // Formulário para adicionar nova compatibilidade

  isLoading: boolean = true; // Controla o carregamento inicial de dados
  isAddingCompatibility: boolean = false; // Controla o estado de adição de compatibilidade

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private partService = inject(PartService);
  private vehicleModelService = inject(VehicleModelService);
  private fb = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.initForm(); // Inicializa o formulário de adição

    // Obtém o ID da peça da URL. Usa switchMap para carregar a peça e os modelos de veículos em sequência.
    this.route.paramMap.pipe(
      switchMap(params => {
        this.partId = params.get('id');
        if (!this.partId) {
          this.notificationService.showError('ID da peça não fornecido.');
          this.router.navigate(['/parts']);
          return new Observable(); // Retorna um Observable vazio para parar a cadeia
        }
        // Usa forkJoin para carregar a peça e todos os modelos de veículos em paralelo
        return forkJoin([
          this.partService.getPartById(this.partId),
          this.vehicleModelService.getAllVehicleModels() // Assume que a API pode retornar todos
        ]);
      })
    ).subscribe({
      next: (result) => {
        const [part, vehicleModelsResponse] = result as [Part, PageResponse<VehicleModel>];
        this.part = part;
        this.availableVehicleModels = vehicleModelsResponse.content;
        this.loadPartCompatibilities(); // Carrega as compatibilidades após ter os dados base
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes da peça ou modelos de veículos:', err);
        this.notificationService.showError('Erro ao carregar dados da peça ou modelos de veículos.');
        this.isLoading = false;
        // Opcional: redirecionar se a peça não for encontrada
        // this.router.navigate(['/parts']);
      }
    });
  }

  /**
   * Inicializa o formulário para adicionar novas compatibilidades.
   */
  initForm(): void {
    this.addCompatibilityForm = this.fb.group({
      vehicleModel: [null, Validators.required], // Armazenará o ID do modelo de veículo selecionado
      notes: ['', Validators.maxLength(500)]
    });
  }

  /**
   * Carrega as compatibilidades da peça atual, com paginação.
   */
  loadPartCompatibilities(): void {
    if (!this.partId) return; // Garante que o ID da peça está disponível

    this.isLoading = true; // Ativa o spinner para a lista de compatibilidades
    this.partService.getPartCompatibilities(this.partId, this.paginationParams).subscribe({
      next: (response) => {
        this.compatibilities = response.content;
        this.pageResponse = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar compatibilidades da peça:', err);
        this.notificationService.showError('Não foi possível carregar as compatibilidades desta peça.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Manipula a mudança de página na lista de compatibilidades.
   * @param page O novo número da página (1-base da UI).
   */
  onPageChange(page: number): void {
    this.paginationParams.page = page - 1; // Ajusta para 0-base do backend
    this.loadPartCompatibilities();
  }

  /**
   * Submete o formulário para adicionar uma nova compatibilidade.
   */
  onAddCompatibilitySubmit(): void {
    if (this.addCompatibilityForm.invalid || !this.partId) {
      this.addCompatibilityForm.markAllAsTouched();
      this.notificationService.showWarning('Por favor, selecione um modelo de veículo.');
      return;
    }

    this.isAddingCompatibility = true; // Ativa o estado de carregamento do botão
    const vehicleModelId = this.addCompatibilityForm.get('vehicleModel')?.value;
    const notes = this.addCompatibilityForm.get('notes')?.value;

    this.partService.addPartCompatibility(this.partId, vehicleModelId, notes).subscribe({
      next: () => {
        this.notificationService.showSuccess('Compatibilidade adicionada com sucesso!');
        this.addCompatibilityForm.reset({ vehicleModel: null, notes: '' }); // Limpa o formulário
        this.loadPartCompatibilities(); // Recarrega a lista para mostrar a nova compatibilidade
        this.isAddingCompatibility = false;
      },
      error: (err) => {
        console.error('Erro ao adicionar compatibilidade:', err);
        this.isAddingCompatibility = false;
        // O ErrorInterceptor já exibirá a mensagem de erro específica.
      }
    });
  }

  /**
   * Inicia o processo de remoção de uma compatibilidade, com confirmação.
   * @param compatibilityId O ID da compatibilidade a ser removida.
   */
  deleteCompatibility(compatibilityId: string | undefined): void {
    if (!this.partId || !compatibilityId) {
      this.notificationService.showWarning('IDs necessários para exclusão da compatibilidade não fornecidos.');
      return;
    }

    const modalRef = this.modalService.open(ConfirmDialog);
    modalRef.componentInstance.title = 'Confirmar Remoção';
    modalRef.componentInstance.message = 'Tem certeza que deseja remover esta compatibilidade?';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.partService.deletePartCompatibility(this.partId!, compatibilityId).subscribe({
          next: () => {
            this.notificationService.showSuccess('Compatibilidade removida com sucesso!');
            this.loadPartCompatibilities(); // Recarrega a lista
          },
          error: (err) => {
            console.error('Erro ao remover compatibilidade:', err);
          }
        });
      }
    }).catch(() => {});
  }
}