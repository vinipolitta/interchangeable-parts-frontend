// src/app/shared/shared.module.ts
// Este NgModule atua como um módulo "barril" para agrupar e re-exportar módulos Angular comuns,
// módulos de terceiros (como ng-bootstrap) e os componentes Standalone criados na pasta `shared`.
// Facilita a importação em outros componentes Standalone.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';          // Para ngIf, ngFor, etc.
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Para formulários reativos e de template
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';    // Módulo principal do ng-bootstrap
import { AlertComponent } from './components/alert/alert';
import { Pagination } from './components/pagination/pagination';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';

const components = [
    AlertComponent,
    Pagination,
    ConfirmDialog,
    LoadingSpinner
]

const modules = [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgbModalModule
]


@NgModule({
    declarations: [], // Em um SharedModule moderno (para Standalone), não há declarations.
    // Componentes Standalone são importados diretamente ou exportados.
    imports: [
        ...modules,
        ...components,
        // Não precisamos importar os componentes Standalone aqui, pois eles serão exportados.
    ],
    exports: [
        // Exporta módulos Angular e de terceiros que são comumente usados.
        ...modules,
        ...components,
        // Exporta os componentes Standalone para que possam ser importados por outros componentes
        // que simplesmente importarem SharedModule.

    ]
})
export class SharedModule { }