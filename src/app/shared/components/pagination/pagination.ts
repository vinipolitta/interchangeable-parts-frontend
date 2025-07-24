import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {
  // Input: Tamanho total da coleção de itens (totalElements do backend).
  // Usado pelo ngb-pagination para calcular o número total de páginas.
  collectionSize = input<number>(0);

  // Input: Quantidade de itens por página (size do backend).
  pageSize = input<number>(10);

  // Input: Página atual (number do backend + 1 para ser 1-base na UI).
  // `[(page)]` permite two-way binding com o componente ngb-pagination.
  page = input<number>(1);

  // Output: Emite o novo número da página (1-base) quando o usuário clica em um link de página.
  pageChange = output<number>();

  /**
   * Manipula o evento de mudança de página do componente ngb-pagination.
   * @param newPage O novo número da página selecionado (1-base).
   */
  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage); // Emite o novo número da página.
  }

}
