import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnonymousRoutingModule } from './anonymous-routing.module';
import { WriteOfferComponent } from './write-offer/write-offer.component';
import { SharedModule } from '../../shared-modules/shared.module';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatTableModule, MatTooltipModule } from '@angular/material';

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
    WriteOfferComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AnonymousRoutingModule,
    ...MatModules
  ]
})
export class AnonymousModule { }
