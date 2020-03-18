import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ESignatureComponent } from './e-signature/e-signature.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { SpqSignatureComponent } from './spq-signature/spq-signature.component';
import { AddendumSignatureComponent } from './addendum-signature/addendum-signature.component';

const routes: Routes = [
  {
    path: ':id',
    component: ESignatureComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'spq/:id',
    component: SpqSignatureComponent
  },
  {
    path: 'addendum/:id',
    component: AddendumSignatureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class DigitalSignatureRoutingModule { }
