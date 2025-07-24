import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { Category } from '../../models/categories.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinner,
    RouterLink,
    SharedModule
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup; // Declaração do FormGroup para o formulário
  isEditMode: boolean = false; // Flag para determinar se está no modo de edição ou criação
  categoryId: string | null = null; // Armazena o ID da categoria se estiver no modo de edição
  isLoading: boolean = false; // Flag para controlar a exibição do spinner de carregamento

  // Injeta os serviços e o Router/ActivatedRoute usando a função `inject`
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute); // Para obter parâmetros da URL
  private router = inject(Router);       // Para navegação programática
  private notificationService = inject(NotificationService);

  /**
   * Método de ciclo de vida do Angular, chamado após a inicialização do componente.
   * Determina o modo (edição/criação), inicializa o formulário e carrega a categoria se estiver em edição.
   */
  ngOnInit(): void {
    // Obtém o ID da categoria da URL (se existir)
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId; // Define o modo baseado na presença do ID

    this.initForm(); // Inicializa o formulário com os validadores

    // Se estiver no modo de edição e o ID estiver presente, carrega os dados da categoria
    if (this.isEditMode && this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  /**
   * Inicializa o FormGroup `categoryForm` com os controles e validadores.
   */
  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required], // Campo 'name' é obrigatório
      description: ['', Validators.maxLength(500)] // Campo 'description' tem limite de 500 caracteres
    });
  }

  /**
   * Carrega os dados de uma categoria existente para preencher o formulário no modo de edição.
   * @param id O ID da categoria a ser carregada.
   */
  loadCategory(id: string): void {
    this.isLoading = true; // Ativa o spinner
    this.categoryService.getCategoryById(id).subscribe({
      next: (category: Category) => {
        this.categoryForm.patchValue(category); // Preenche o formulário com os dados da categoria
        this.isLoading = false; // Desativa o spinner
      },
      error: (err: any) => {
        console.error('Erro ao carregar categoria:', err);
        this.notificationService.showError('Erro ao carregar categoria para edição. Verifique o ID.');
        this.isLoading = false; // Desativa o spinner mesmo em caso de erro
        this.router.navigate(['/categories']); // Redireciona para a lista se a categoria não for encontrada
      }
    });
  }

  /**
   * Manipula a submissão do formulário.
   * Valida o formulário e chama o serviço para criar ou atualizar a categoria.
   */
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched(); // Marca todos os campos como 'touched' para exibir mensagens de validação
      this.notificationService.showWarning('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.isLoading = true; // Ativa o spinner durante a submissão
    const category: Category = this.categoryForm.value; // Obtém os valores do formulário

    if (this.isEditMode && this.categoryId) {
      // Modo de edição: chama o serviço para atualizar a categoria
      this.categoryService.updateCategory(this.categoryId, category).subscribe({
        next: () => {
          this.notificationService.showSuccess('Categoria atualizada com sucesso!');
          this.router.navigate(['/categories']); // Redireciona para a lista após sucesso
        },
        error: (err: any) => {
          console.error('Erro ao atualizar categoria:', err);
          this.isLoading = false; // Desativa o spinner em caso de erro
          // O ErrorInterceptor já exibirá a mensagem de erro.
        }
      });
    } else {
      // Modo de criação: chama o serviço para criar uma nova categoria
      this.categoryService.createCategory(category).subscribe({
        next: () => {
          this.notificationService.showSuccess('Categoria criada com sucesso!');
          this.router.navigate(['/categories']); // Redireciona para a lista após sucesso
        },
        error: (err: any) => {
          console.error('Erro ao criar categoria:', err);
          this.isLoading = false; // Desativa o spinner em caso de erro
          // O ErrorInterceptor já exibirá a mensagem de erro.
        }
      });
    }
  }
}