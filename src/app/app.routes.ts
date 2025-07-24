// Define as rotas principais da aplicação.
// Utiliza lazy loading com 'loadComponent' para carregar os componentes de forma assíncrona,
// melhorando o tempo de carregamento inicial da aplicação.

import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; // Importa o guarda de rota (será criado no Passo 3.3)

export const appRoutes: Routes = [
  // Redireciona a rota raiz para a lista de categorias como página inicial.
  { path: '', redirectTo: 'categories', pathMatch: 'full' },

  // --- Rotas para Categorias ---
  // Rota para a listagem de categorias.
  {
    path: 'categories',
    loadComponent: () => import('./page/categories/components/category-list/category-list')   
                            .then(c => c.CategoryListComponent),
    // canActivate: [AuthGuard] // Exemplo: Adicione um AuthGuard se esta rota exigir autenticação
  },
  // Rota para criar uma nova categoria.
  {
    path: 'categories/new',
    loadComponent: () => import('./page/categories/components/category-form/category-form')
                            .then(c => c.CategoryFormComponent),
    // canActivate: [AuthGuard]
  },
  // Rota para editar uma categoria existente, passando o ID como parâmetro.
  {
    path: 'categories/edit/:id',
    loadComponent: () => import('./page/categories/components/category-form/category-form')
                            .then(c => c.CategoryFormComponent),
    // canActivate: [AuthGuard]
  },

  // --- Rotas para Peças (Parts) ---
  // Rota para a listagem de peças.
  {
    path: 'parts',
    loadComponent: () => import('./page/parts/components/part-list/part-list')
                            .then(c => c.PartListComponent),
    // canActivate: [AuthGuard]
  },
  // Rota para criar uma nova peça.
  {
    path: 'parts/new',
    loadComponent: () => import('./page/parts/components/part-form/part-form')
                            .then(c => c.PartFormComponent),
    // canActivate: [AuthGuard]
  },
  // Rota para editar uma peça existente, passando o ID como parâmetro.
  {
    path: 'parts/edit/:id',
    loadComponent: () => import('./page/parts/components/part-form/part-form')
                            .then(c => c.PartFormComponent),
    // canActivate: [AuthGuard]
  },
  // Rota para gerenciar as compatibilidades de uma peça específica.
  // O ID da peça é passado como parâmetro.
  {
    path: 'parts/:id/compatibilities',
    loadComponent: () => import('./page/parts/components/part-compatibility/part-compatibility')
                            .then(c => c.PartCompatibilityComponent),
    // canActivate: [AuthGuard]
  },

  // --- Rotas para Modelos de Veículos (VehicleModel) ---
  // Rota para a listagem de modelos de veículos.
  {
    path: 'vehicle-models',
    loadComponent: () => import('./page/vehicle-models/components/vehicle-models-list/vehicle-models-list')
                            .then(c => c.VehicleModelListComponent),
    // canActivate: [AuthGuard]
  },
  // Rota para criar um novo modelo de veículo.
  {
    path: 'vehicle-models/new',
    loadComponent: () => import('./page/vehicle-models/components/vehicle-models-form/vehicle-models-form')
                            .then(c => c.VehicleModelFormComponent),
    // canActivate: [AuthGuard]
  },
  // Rota para editar um modelo de veículo existente, passando o ID como parâmetro.
  {
    path: 'vehicle-models/edit/:id',
            loadComponent: () => import('./page/vehicle-models/components/vehicle-models-form/vehicle-models-form')
                            .then(c => c.VehicleModelFormComponent),
    // canActivate: [AuthGuard]
  },

  // Exemplo de rota de login (se for implementado).
  // { path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },

  // Rota curinga: Redireciona para a página inicial (categorias) se nenhuma outra rota for encontrada.
  { path: '**', redirectTo: 'categories' }
];