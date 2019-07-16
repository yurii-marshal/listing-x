import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnonymousRoutingModule } from './anonymous-routing.module';
import { SharedModule } from '../../shared-modules/shared.module';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WriteAnonymousOfferComponent } from './write-anonymous-offer/write-anonymous-offer.component';

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
    WriteAnonymousOfferComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MatModules,
    SharedModule,
    RouterModule,
    AnonymousRoutingModule
  ]
})
export class AnonymousModule { }
