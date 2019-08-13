import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignatureRoutingModule } from './digital-signature-routing.module';
import { ESignatureComponent } from './e-signature/e-signature.component';
import { SharedModule } from '../../shared-modules/shared.module';
import { MatButtonModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { SignatureBoxComponent } from './components/signature-box/signature-box.component';
import { FinishSigningDialogComponent } from './dialogs/finish-signing-dialog/finish-signing-dialog.component';

@NgModule({
  declarations: [ESignatureComponent, SignatureBoxComponent, FinishSigningDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    DigitalSignatureRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  entryComponents: [
    FinishSigningDialogComponent
  ]
})
export class DigitalSignatureModule { }
