import { QueryList } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { IDataService } from '../interfaces/data.service';

/**
 * This is a custom data source class with basic logic for working with
 * either Angular Material or Angular CDK table.
 */
export class BaseTableDataSource<T> extends DataSource<any> {
  /** Reload trigger subject. */
  protected reloadTrigger = new Subject<any>();

  /** Filter change subject. */
  protected filterChange = new BehaviorSubject<string>('');

  /** Array of data that should be rendered by the table, where each object represents a row. */
  private _data = new BehaviorSubject<T[]>(null);

  /** Total items count received from server response. */
  private _count: number;

  get filter() {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  set data(value: T[]) {
    this._data.next(value);
  }

  get data() {
    return this._data.value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    if (!this.filter) { // Apply if there is no active filters.
      this._count = value;
    }
  }

  constructor(protected service: IDataService<any>,
              protected paginators: QueryList<MatPaginator>,
              protected sort: MatSort) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    const displayDataChanges = this.getChangesEmitters();

    return merge(...displayDataChanges)
      .pipe(
        map(() => this.buildQueryParams()),
        debounceTime(500),
        switchMap(params => this.service.loadList(params)),
        map((response: any) => {
          this.count = response.count || 0;
          this.data = response.results;
          return this.data;
        })
      );
  }


  /**
   * Emits forced reloading of data source data.
   */
  reload() {
    this.reloadTrigger.next();
  }

  /**
   * Serialize paginator, sorting and filters data as HTTP query params.
   * In case we need handle additional component we need decorate it ancestor.
   */
  protected buildQueryParams(): HttpParams {
    let params = new HttpParams();

    if (this.paginators && this.paginators.length > 0) {
      params = params
        .set('offset', `${this.paginators.first.pageIndex + 1}`)
        .set('limit', `${this.paginators.first.pageSize}`);
    }

    if (this.sort && this.sort.active && this.sort.direction !== '') {
      const direction: string = this.sort.direction  === 'desc' ? '-' : '';
      params = params.set('ordering', `${direction}${this.sort.active}`);
    } else {
      params = params.set('ordering', '-id'); // Default ordering
    }

    if (this.filter) {
      this.parseFilters()
        .forEach(([key, value]) => params = params.append(key, value));
    }
    return params;
  }

  /**
   * Returns list of table related components data changes emitters.
   */
  protected getChangesEmitters(): Observable<T>[] {
    const emitters: Observable<any>[] = [
      this.reloadTrigger,
      this.filterChange
    ];

    // Sort.
    if (this.sort) {
      emitters.push(this.sort.sortChange);
    }

    // Paginators.
    if (this.paginators && this.paginators.length > 0) {
      emitters.push(this.paginators.first.page);
      if (this.paginators.length > 1) {
        emitters.push(this.paginators.last.page);
      }
    }
    return emitters;
  }

  /**
   * Parses filter string into array similar to dictionary.
   */
  private parseFilters(): any[] {
    return _.chain(this.filter)
      .split('&')
      .map(item => item.split('='))
      .value();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    // tslint:disable-line
  }
}
