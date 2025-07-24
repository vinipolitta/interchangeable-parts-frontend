// Este NgModule pode ser usado para agrupar e organizar provedores globais,
// embora com `providedIn: 'root'` e `app.config.ts`, sua necessidade seja menor.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [], // Não há declarações para componentes, diretivas, pipes aqui em um módulo core moderno.
  imports: [
    CommonModule // Usado para funcionalidades comuns do Angular.
  ],
  // Provedores como ApiService, AuthService, etc. já usam `providedIn: 'root'`
  // Interceptores são registrados em `app.config.ts` com `withInterceptors`
  // Guards são usados diretamente nas rotas com `inject`
  // Este módulo serve mais como um agrupador lógico para a pasta 'core'
  // se você tiver outros serviços que não usam providedIn: 'root'
  providers: [] // Provedores que seriam injetados aqui.
})
export class CoreModule { }