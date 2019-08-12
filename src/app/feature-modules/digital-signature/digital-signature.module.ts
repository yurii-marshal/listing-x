import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignatureRoutingModule } from './digital-signature-routing.module';
import { ESignatureComponent } from './e-signature/e-signature.component';
import { SharedModule } from '../../shared-modules/shared.module';
import { MatIconModule } from '@angular/material';
import { SignatureBoxComponent } from './signature-box/signature-box.component';

@NgModule({
  declarations: [ESignatureComponent, SignatureBoxComponent],
  imports: [
    CommonModule,
    SharedModule,
    DigitalSignatureRoutingModule,
    MatIconModule
  ]
})
export class DigitalSignatureModule { }
