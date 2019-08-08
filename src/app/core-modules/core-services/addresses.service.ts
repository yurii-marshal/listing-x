import { Injectable, Injector } from '@angular/core';
import { Address } from '../models/address';
import { ApiEndpoint } from '../enums/api-endpoints';
import { BaseDataService } from '../base-classes/base-data-service';

@Injectable()
export class AddressesService extends BaseDataService<Address> {

  protected crudEndpoint: ApiEndpoint = ApiEndpoint.Addresses;

  constructor(protected injector: Injector) {
    super(injector);
  }
}
