import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ESignatureComponent } from './e-signature/e-signature.component';

const routes: Routes = [
  {
    path: ':id',
    component: ESignatureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalSignatureRoutingModule { }
