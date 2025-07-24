import { Component, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialog {
  // Input: Título do modal de confirmação.
  title = input<string>('Confirmar Ação');
  // // Input: Mensagem principal do diálogo de confirmação.
  message = input<string>('Você tem certeza que deseja realizar esta ação?');

  // Injeta NgbActiveModal para permitir que o componente controle seu próprio modal (fechar, dismiss).
  constructor(public activeModal: NgbActiveModal) { }

  // Os botões "Cancelar" e "Confirmar" chamam `activeModal.dismiss()` ou `activeModal.close()`,
  // respectivamente, que emitem um valor (string neste caso) para quem abriu o modal.
}