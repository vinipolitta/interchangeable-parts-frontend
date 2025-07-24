import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Category } from '../../../categories/models/categories.model';
import { CategoryService } from '../../../categories/services/category.service';
import { Part } from '../../models/part.model';
import { PartService } from '../../services/part.service';

@Component({
  selector: 'app-part-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinner,
    RouterLink,
    SharedModule
  ],
  templateUrl: './part-form.html',
  styleUrl: './part-form.css'
})
export class PartFormComponent implements OnInit {
  partForm!: FormGroup;
  isEditMode: boolean = false;
  partId: string | null = null;
  isLoading: boolean = false;
  categories: Category[] = []; // Array para armazenar as categorias para o dropdown

  private fb = inject(FormBuilder);
  private partService = inject(PartService);
  private categoryService = inject(CategoryService); // Injeta o serviço de categoria
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.partId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.partId;

    this.initForm();
    this.loadCategories(); // Carrega as categorias para o dropdown

    if (this.isEditMode && this.partId) {
      this.loadPart(this.partId);
    }
  }

  /**
   * Inicializa o FormGroup `partForm` com os controles e validadores.
   */
  initForm(): void {
    this.partForm = this.fb.group({
      name: ['', Validators.required],
      partNumber: ['', Validators.required],
      // O `category` é um objeto Category. A validação `Validators.required` verifica se um valor foi selecionado.
      category: [null, Validators.required],
      description: ['', Validators.maxLength(500)]
    });
  }

  /**
   * Carrega todas as categorias para popular o dropdown de seleção de categoria.
   */
  loadCategories(): void {
    // Assume que `getAllCategories` pode ser chamado sem parâmetros de paginação
    // ou que ele tem um comportamento padrão para retornar todas se nenhum for fornecido.
    // Se a API de categoria não suportar `getAll` sem paginação, você pode buscar
    // a primeira página ou adicionar um parâmetro `size` grande.
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias para o dropdown:', err);
        this.notificationService.showError('Não foi possível carregar as categorias.');
      }
    });
  }

  /**
   * Carrega os dados de uma peça existente para preencher o formulário no modo de edição.
   */
  loadPart(id: string): void {
    this.isLoading = true;
    this.partService.getPartById(id).subscribe({
      next: (part) => {
        // patchValue preenche o formulário. Certifique-se de que `part.category` é o objeto completo
        // que o `<select>` com `[ngValue]="category"` espera.
        this.partForm.patchValue(part);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar peça:', err);
        this.notificationService.showError('Erro ao carregar peça para edição. Verifique o ID.');
        this.isLoading = false;
        this.router.navigate(['/parts']);
      }
    });
  }

  /**
   * Manipula a submissão do formulário.
   * Valida o formulário e chama o serviço para criar ou atualizar a peça.
   */
  onSubmit(): void {
    if (this.partForm.invalid) {
      this.partForm.markAllAsTouched();
      this.notificationService.showWarning('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isLoading = true;
    const part: Part = this.partForm.value;

    let operation: Observable<Part>;

    if (this.isEditMode && this.partId) {
      operation = this.partService.updatePart(this.partId, part);
    } else {
      operation = this.partService.createPart(part);
    }

    operation.subscribe({
      next: () => {
        this.notificationService.showSuccess(`Peça ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
        this.router.navigate(['/parts']);
      },
      error: (err) => {
        console.error(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} peça:`, err);
        this.isLoading = false;
      }
    });
  }
}
