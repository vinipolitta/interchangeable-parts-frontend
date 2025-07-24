import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { Category } from '../../models/categories.model';
import { PageResponse, PaginationParams } from '../../../../shared/models/pagination.model';
import { CategoryService } from '../../services/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    RouterLink,
    SharedModule
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = []
  paginationParams: PaginationParams = { page: 0, size: 10, sort: 'name,asc' }; // Ordenar por nome da categoria
  isLoading: boolean = false;

  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private notificationService = inject(NotificationService);
  teste!: PageResponse<Category>;

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Carrega as categorias do backend, aplicando os parâmetros de paginação e ordenação.
   */
  loadCategories(): void {
    console.log('loadCategories');
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response;
        console.log('categories', this.categories);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.notificationService.showError('Não foi possível carregar as categorias. Tente novamente mais tarde.');
        this.isLoading = false;
        this.categories = []; // Garante que a lista esteja vazia em caso de erro
      }
    });
  }

  /**
   * Manipula o evento de mudança de página do componente de paginação.
   * @param page O novo número da página (1-base da UI).
   */
  onPageChange(page: number): void {
    this.paginationParams.page = page - 1; // Ajusta para 0-base do backend
    this.loadCategories();
  }

  /**
   * Navega para a tela de edição de categoria.
   * @param id O ID da categoria a ser editada.
   */
  editCategory(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/categories/edit', id]);
    } else {
      this.notificationService.showWarning('ID da categoria não encontrado para edição.');
    }
  }

  /**
   * Inicia o processo de exclusão de uma categoria, exibindo um modal de confirmação.
   * @param id O ID da categoria a ser deletada.
   */
  deleteCategory(id: string | undefined): void {
    if (!id) {
      this.notificationService.showWarning('ID da categoria não fornecido para exclusão.');
      return;
    }

    const modalRef = this.modalService.open(ConfirmDialog);
    console.log('modalRef', modalRef.componentInstance);
    modalRef.componentInstance.title = 'Confirmar Exclusão';
    modalRef.componentInstance.message = 'Tem certeza que deseja deletar esta categoria? Esta ação não pode ser desfeita.';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Categoria deletada com sucesso!');
            this.loadCategories(); // Recarrega a lista após a exclusão
          },
          error: (err) => {
            console.error('Erro ao deletar categoria:', err);
            // O ErrorInterceptor já exibirá a mensagem de erro específica.
          }
        });
      }
    }).catch(() => {}); // Captura dismiss do modal (cancelar, fechar)
  }
}