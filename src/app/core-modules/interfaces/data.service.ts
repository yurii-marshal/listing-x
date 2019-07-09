import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Data service interface with basic CRUD operations
 */
export interface IDataService<TModel> {

  loadList(params?: HttpParams): Observable<TModel[]>;

  loadOne(slug: string): Observable<TModel>;

  add(model: TModel): Observable<TModel>;

  update(model: TModel): Observable<TModel>;

  delete(id: number): Observable<boolean>;

  /**
   * Wrap raw data from server into angular compatible model
   * */
  wrap(item: any): TModel;
}