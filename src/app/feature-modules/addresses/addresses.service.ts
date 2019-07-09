import { Injectable } from '@angular/core';
import { IDataService } from '../../core-modules/interfaces/data.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiEndpoint } from '../../core-modules/enums/auth-endpoints';
import { Address } from '../model';

@Injectable()
export class AddressesService implements IDataService <Address> {

  constructor(private http: HttpClient) {
  }

  loadList(params?: HttpParams): Observable<Address[]> {
    return this.http.get<Address[]>(ApiEndpoint.Addresses)
  }

  add(model: Address): Observable<Address> {
    return this.http.post<Address>(ApiEndpoint.Addresses, model.serialize())
  }

  delete(id: number): Observable<boolean> {
    return undefined;
  }


  loadOne(id): Observable<any> {
    return undefined;
  }

  update(model: Address): Observable<Address> {
    const url: string = `${ApiEndpoint.Addresses}/${model.id}`;
    return this.http.put<Address>(url, model.serialize())
  }

  wrap(item: any): Address {
    return new Address(item);
  }
}
