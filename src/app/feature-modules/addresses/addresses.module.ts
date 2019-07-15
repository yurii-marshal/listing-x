import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressesRoutingModule } from './addresses-routing.module';
import { AddressesListComponent } from './addresses-list/addresses-list.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';
import { AddressesService } from './addresses.service';
import { ReactiveFormsModule } from '@angular/forms';

const MatModules  = [
  MatButtonModule,
  MatDialogModule,
  MatTableModule,
  MatIconModule,
  MatSnackBarModule,
  MatTooltipModule
];

@NgModule({
  declarations: [
    AddressesListComponent
  ],
  imports: [
    CommonModule,
    AddressesRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    ...MatModules,
    SharedModule
  ],
  providers: [AddressesService],
})
export class AddressesModule { }
