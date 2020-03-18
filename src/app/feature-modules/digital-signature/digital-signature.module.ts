import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignatureRoutingModule } from './digital-signature-routing.module';
import { ESignatureComponent } from './e-signature/e-signature.component';
import { SharedModule } from '../../shared-modules/shared.module';
import { MatButtonModule, MatDialogModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { SignatureBoxComponent } from './components/signature-box/signature-box.component';
import { FinishSigningDialogComponent } from './dialogs/finish-signing-dialog/finish-signing-dialog.component';
import { TransactionService } from '../portal/services/transaction.service';
import { SpqSignatureComponent } from './spq-signature/spq-signature.component';
import { AddendumSignatureComponent } from './addendum-signature/addendum-signature.component';
import { ContractDocumentComponent } from './components/contract-document/contract-document.component';
import { SpqDocumentComponent } from './components/spq-document/spq-document.component';
import { AddendumDocumentComponent } from './components/addendum-document/addendum-document.component';

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
    FinishSigningDialogComponent,
    SpqSignatureComponent,
    AddendumSignatureComponent,
    ContractDocumentComponent,
    SpqDocumentComponent,
    AddendumDocumentComponent],
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
