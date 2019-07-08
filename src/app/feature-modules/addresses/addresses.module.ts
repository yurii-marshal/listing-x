import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressesRoutingModule } from './addresses-routing.module';
import { AddressesListComponent } from './addresses-list/addresses-list.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';

const matModules  = [
  MatButtonModule,
  MatDialogModule
];

@NgModule({
  declarations: [AddressesListComponent],
  imports: [
    CommonModule,
    RouterModule,
    ...matModules,
    AddressesRoutingModule,
    SharedModule
  ]
})
export class AddressesModule { }
