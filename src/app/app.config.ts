// Configuração principal da aplicação Angular.
// Define os provedores de serviços globais e a configuração de módulos.

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes'; // Importa as rotas definidas
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // Importa o módulo NgbModule do ng-bootstrap
import { ErrorInterceptor } from './core/interceptor/error.interceptor';

// Importa os interceptores HTTP personalizados (serão criados no Passo 3.2).
// import { AuthInterceptor } from './core/interceptors/auth.interceptor'; // Descomente quando implementar autenticação

export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita o roteamento na aplicação.
    provideRouter(appRoutes),
    // Habilita a hidratação do cliente para aplicações SSR (Server-Side Rendering),
    // que permite que o HTML gerado no servidor seja interativo no cliente.
    provideClientHydration(),

    // Habilita o HttpClient para fazer requisições HTTP.
    // `withFetch()`: Usa a Fetch API nativa do navegador para requisições HTTP,
    //               compatível com SSR.
    // `withInterceptors()`: Registra interceptores HTTP que podem processar
    //                      requisições e respostas globalmente (ex: tratamento de erros, autenticação).
    provideHttpClient(
      withFetch(),
      withInterceptors([
        ErrorInterceptor, // Interceptor para tratamento global de erros HTTP
        // AuthInterceptor, // Interceptor para adicionar token de autenticação (JWT)
      ])
    ),

    // Importa o NgbModule globalmente.
    // `importProvidersFrom` é usado para importar NgModules em uma configuração de aplicação Standalone,
    // registrando seus serviços e declarando seus componentes para uso global.
    importProvidersFrom(NgbModule),
  ]
};