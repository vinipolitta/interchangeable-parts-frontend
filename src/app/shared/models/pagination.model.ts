// Define as interfaces para os parâmetros de paginação e para a estrutura da resposta paginada do backend.

/**
 * @interface PaginationParams
 * @description Parâmetros que o frontend envia para o backend para controle de paginação e ordenação.
 */
export interface PaginationParams {
    page?: number; // Número da página (0-base no backend, 1-base na UI geralmente).
    size?: number; // Quantidade de itens por página.
    sort?: string; // Campo e direção da ordenação, ex: "name,asc", "id,desc".
    // Adicione aqui outros parâmetros de filtro genéricos que podem ser usados em várias listas.
    name?: string; // Exemplo de filtro por nome.
    // ... outros filtros comuns
  }
  
  /**
   * @interface PageResponse<T>
   * @description Estrutura de resposta de paginação esperada do backend, tipicamente do Spring Data REST.
   * @template T O tipo de dado dos elementos contidos na página.
   */
  export interface PageResponse<T> {
    content: T[]; // Lista de itens na página atual.
    pageable: { // Informações sobre a requisição de paginação.
      pageNumber: number; // O número da página solicitada (0-base).
      pageSize: number;   // O tamanho da página solicitada.
      sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;           // Indica se a página atual é a última página.
    totalPages: number;    // Número total de páginas disponíveis.
    totalElements: number; // Número total de elementos em todas as páginas.
    size: number;          // O número de elementos na página atual.
    number: number;        // O número da página atual (0-base).
    first: boolean;          // Indica se a página atual é a primeira página.
    numberOfElements: number; // O número real de elementos nesta página.
    empty: boolean;          // Indica se a página atual está vazia (não contém elementos).
  }