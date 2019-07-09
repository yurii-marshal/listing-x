import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressesRoutingModule } from './addresses-routing.module';
import { AddressesListComponent } from './addresses-list/addresses-list.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatDialogModule, MatIconModule, MatTableModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';
import { AddressesService } from './addresses.service';

const matModules  = [
  MatButtonModule,
  MatDialogModule,
  MatTableModule,
  MatIconModule
];

@NgModule({
  declarations: [
    AddressesListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ...matModules,
    AddressesRoutingModule,
    SharedModule
  ],
  providers: [AddressesService]
})
export class AddressesModule { }
