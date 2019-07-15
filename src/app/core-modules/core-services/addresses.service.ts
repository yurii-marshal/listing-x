import { Injectable } from '@angular/core';
import { IDataService } from '../interfaces/data.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiEndpoint } from '../enums/auth-endpoints';
import { Address } from '../models/address';

@Injectable()
export class AddressesService implements IDataService <Address> {

  constructor(private http: HttpClient) {
  }

  loadList(params?: HttpParams): Observable<Address[]> {
    return this.http.get<Address[]>(ApiEndpoint.Addresses, { params })
  }

  add(model: Address): Observable<Address> {
    return this.http.post<Address>(ApiEndpoint.Addresses, model.serialize())
  }

  delete(id: number): Observable<void> {
    const url: string = `${ApiEndpoint.Addresses}${id}/`; // common func
    return this.http.delete<void>(url)
  }


  loadOne(id): Observable<any> {
    return undefined;
  }

  update(model: Address): Observable<Address> {
    const url: string = `${ApiEndpoint.Addresses}${model.id}/`; // common func
    return this.http.put<Address>(url, model.serialize())
  }

  wrap(item: any): Address {
    return new Address(item);
  }
}
