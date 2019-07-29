import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignatureRoutingModule } from './digital-signature-routing.module';
import { ESignatureComponent } from './e-signature/e-signature.component';
import { SharedModule } from '../../shared-modules/shared.module';

@NgModule({
  declarations: [ESignatureComponent],
  imports: [
    CommonModule,
    SharedModule,
    DigitalSignatureRoutingModule
  ]
})
export class DigitalSignatureModule { }
