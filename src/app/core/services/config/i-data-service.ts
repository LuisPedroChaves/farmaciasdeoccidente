import { Observable } from 'rxjs';

export interface IDataService<T> {
  loadData(filter?): void;
  getData(filter?): void;
  readData(): Observable<T>;
  setData(obj: T);
  invalidateData(): void;
}
