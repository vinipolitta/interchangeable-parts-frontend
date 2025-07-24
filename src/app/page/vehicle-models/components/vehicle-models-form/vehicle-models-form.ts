import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification.service';
import { VehicleModel } from '../../models/vehicle-model.model';
import { VehicleModelService } from '../../services/vehicle-model.service';
import { SharedModule } from '../../../../shared/shared.module';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-models-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinner,
    RouterLink,
    SharedModule  
  ],
  templateUrl: './vehicle-models-form.html',
  styleUrl: './vehicle-models-form.css'
})
export class VehicleModelFormComponent implements OnInit {
  vehicleModelForm!: FormGroup;
  isEditMode: boolean = false;
  vehicleModelId: string | null = null;
  isLoading: boolean = false;

  private fb = inject(FormBuilder);
  private vehicleModelService = inject(VehicleModelService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.vehicleModelId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.vehicleModelId;

    this.initForm();

    if (this.isEditMode && this.vehicleModelId) {
      this.loadVehicleModel(this.vehicleModelId);
    }
  }

  /**
   * Inicializa o FormGroup `vehicleModelForm` com os controles e validadores.
   */
  initForm(): void {
    const currentYear = new Date().getFullYear();
    this.fb = new FormBuilder(); // Re-initializing fb, though `inject` already provides it
    this.vehicleModelForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      year: [null, [Validators.min(1886), Validators.max(currentYear)]], // Anos realistas para veículos
      description: ['', Validators.maxLength(500)]
    });
  }

  /**
   * Carrega os dados de um modelo de veículo existente.
   */
  loadVehicleModel(id: string): void {
    this.isLoading = true;
    this.vehicleModelService.getVehicleModelById(id).subscribe({
      next: (model) => {
        this.vehicleModelForm.patchValue(model);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar modelo de veículo:', err);
        this.notificationService.showError('Erro ao carregar modelo de veículo para edição. Verifique o ID.');
        this.isLoading = false;
        this.router.navigate(['/vehicle-models']);
      }
    });
  }

  /**
   * Manipula a submissão do formulário.
   */
  onSubmit(): void {
    if (this.vehicleModelForm.invalid) {
      this.vehicleModelForm.markAllAsTouched();
      this.notificationService.showWarning('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isLoading = true;
    const vehicleModel: VehicleModel = this.vehicleModelForm.value;
    let operation: Observable<VehicleModel>;

    if (this.isEditMode && this.vehicleModelId) {
      operation = this.vehicleModelService.updateVehicleModel(this.vehicleModelId, vehicleModel);
    } else {
      operation = this.vehicleModelService.createVehicleModel(vehicleModel);
    }

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Modelo de veículo ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        this.router.navigate(['/vehicle-models']);
      },
      error: (err) => {
        console.error(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} modelo de veículo:`, err);
        this.isLoading = false;
      }
    });
  }
}
