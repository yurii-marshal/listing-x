import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignatureRoutingModule } from './digital-signature-routing.module';
import { ESignatureComponent } from './e-signature/e-signature.component';
import { SharedModule } from '../../shared-modules/shared.module';
import { MatButtonModule, MatDialogModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { TransactionService } from '../portal/services/transaction.service';
import { SpqSignatureComponent } from './spq-signature/spq-signature.component';
import { AddendumSignatureComponent } from './addendum-signature/addendum-signature.component';

const MatModules = [
  MatIconModule,
  MatButtonModule,
  MatProgressBarModule,
  MatDialogModule
];

@NgModule({
  declarations: [
    ESignatureComponent,
    SpqSignatureComponent,
    AddendumSignatureComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DigitalSignatureRoutingModule,
    ...MatModules
  ],
  entryComponents: [],
  providers: [TransactionService]
})
export class DigitalSignatureModule { }
