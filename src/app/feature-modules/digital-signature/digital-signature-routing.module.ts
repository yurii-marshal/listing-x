import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ESignatureComponent } from './e-signature/e-signature.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';

const routes: Routes = [
  {
    path: ':id',
    component: ESignatureComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class DigitalSignatureRoutingModule { }
