import { PageEvent } from '@angular/material/paginator';

/**
 * Estado de un listado paginado en el servidor.
 * Cada pestaña de Documentos, del drawer de proveedor y de Cheques mantiene uno.
 */
export interface PagedList<T> {
  data: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
  /** `false` cuando la búsqueda o un cambio externo invalidó la página cargada. */
  loaded: boolean;
  loading: boolean;
}

export const DEFAULT_PAGE_SIZE = 50;

export function createPagedList<T>(pageSize: number = DEFAULT_PAGE_SIZE): PagedList<T> {
  return {
    data: [],
    total: 0,
    pageIndex: 0,
    pageSize,
    loaded: false,
    loading: false,
  };
}

/** Marca la lista para recargar sin perder el tamaño de página elegido por el usuario. */
export function invalidatePagedList<T>(list: PagedList<T>, resetPage: boolean): void {
  list.loaded = false;
  if (resetPage) {
    list.pageIndex = 0;
  }
}

export function applyPageEvent<T>(list: PagedList<T>, event: PageEvent): void {
  list.pageIndex = event.pageIndex;
  list.pageSize = event.pageSize;
}
