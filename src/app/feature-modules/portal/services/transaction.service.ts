import { Injectable } from '@angular/core';
import { IDataService } from '../../../core-modules/interfaces/data.service';
import { Offer } from '../../../core-modules/models/offer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Transaction } from '../../../core-modules/models/transaction';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../../../core-modules/enums/auth-endpoints';
import { detailUrl } from '../../../core-modules/utils/util';

@Injectable()
export class TransactionService implements IDataService <Transaction> {

  constructor(private http: HttpClient) {
  }

  add(model: Transaction): Observable<Transaction> {
    return undefined;
  }

  delete(id: number): Observable<void> {
    return undefined;
  }

  loadList(params?: HttpParams): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(ApiEndpoint.Transactions, {params});
  }

  loadOne(id: number): Observable<Transaction> {
    const url: string = detailUrl(ApiEndpoint.Transactions, id);
    return this.http.get<Transaction>(url);
  }

  update(model: Transaction): Observable<Transaction> {
    return undefined;
  }
}
