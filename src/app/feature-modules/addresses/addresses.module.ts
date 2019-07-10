import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressesRoutingModule } from './addresses-routing.module';
import { AddressesListComponent } from './addresses-list/addresses-list.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatTableModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';
import { AddressesService } from './addresses.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationBarComponent } from '../../shared-modules/components/confirmation-bar/confirmation-bar.component';

const MatModules  = [
  MatButtonModule,
  MatDialogModule,
  MatTableModule,
  MatIconModule,
  MatSnackBarModule
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
  entryComponents: [
  ]
})
export class AddressesModule { }
