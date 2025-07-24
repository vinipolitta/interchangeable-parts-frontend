import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageResponse, PaginationParams } from '../../../../shared/models/pagination.model';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Part } from '../../models/part.model';
import { PartService } from '../../services/part.service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-part-list',
  imports: [
    CommonModule,
    RouterLink,
    SharedModule
  ],
  templateUrl: './part-list.html',
  styleUrl: './part-list.css'
})
export class PartListComponent implements OnInit {
  parts: Part[] = [];
  pageResponse: PageResponse<Part> | null = null;
  paginationParams: PaginationParams = { page: 0, size: 10, sort: 'name,asc' }; // Ordenar por nome da peça
  isLoading: boolean = false;

  private partService = inject(PartService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadParts();
    console.log('loadParts');
  }

  /**
   * Carrega as peças do backend, aplicando os parâmetros de paginação e ordenação.
   */
  loadParts(): void {
    this.isLoading = true;
    this.partService.getAllParts(this.paginationParams).subscribe({
      next: (response) => {
        // FIX: Garante que 'parts' é sempre um array, mesmo se 'response.content' for undefined/null
        this.parts = response.content ?? [];
        this.pageResponse = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar peças:', err);
        this.notificationService.showError('Não foi possível carregar as peças. Tente novamente mais tarde.');
        this.isLoading = false;
        this.parts = []; // Garante que a lista esteja vazia em caso de erro
      }
    });
  }

  /**
   * Manipula o evento de mudança de página do componente de paginação.
   * @param page O novo número da página (1-base da UI).
   */
  onPageChange(page: number): void {
    this.paginationParams.page = page - 1; // Ajusta para 0-base do backend
    this.loadParts();
  }

  /**
   * Navega para a tela de edição de peça.
   * @param id O ID da peça a ser editada.
   */
  editPart(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/parts/edit', id]);
    } else {
      this.notificationService.showWarning('ID da peça não encontrado para edição.');
    }
  }

  /**
   * Inicia o processo de exclusão de uma peça, exibindo um modal de confirmação.
   * @param id O ID da peça a ser deletada.
   */
  deletePart(id: string | undefined): void {
    if (!id) {
      this.notificationService.showWarning('ID da peça não fornecido para exclusão.');
      return;
    }

    const modalRef = this.modalService.open(ConfirmDialog);
    modalRef.componentInstance.title = 'Confirmar Exclusão';
    modalRef.componentInstance.message = 'Tem certeza que deseja deletar esta peça? Esta ação não pode ser desfeita.';

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.partService.deletePart(id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Peça deletada com sucesso!');
            this.loadParts(); // Recarrega a lista após a exclusão
          },
          error: (err) => {
            console.error('Erro ao deletar peça:', err);
          }
        });
      }
    }).catch(() => {}); // Captura dismiss do modal (cancelar, fechar)
  }
}