import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignatureRoutingModule } from './digital-signature-routing.module';
import { ESignatureComponent } from './e-signature/e-signature.component';
import { SharedModule } from '../../shared-modules/shared.module';
import { MatButtonModule, MatDialogModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { SignatureBoxComponent } from './components/signature-box/signature-box.component';
import { FinishSigningDialogComponent } from './dialogs/finish-signing-dialog/finish-signing-dialog.component';
import { TransactionService } from '../portal/services/transaction.service';

const MatModules = [
  MatIconModule,
  MatButtonModule,
  MatProgressBarModule,
  MatDialogModule
];

@NgModule({
  declarations: [
    ESignatureComponent,
    SignatureBoxComponent,
    FinishSigningDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    DigitalSignatureRoutingModule,
    ...MatModules
  ],
  entryComponents: [
    FinishSigningDialogComponent
  ],
  providers: [TransactionService]
})
export class DigitalSignatureModule { }
