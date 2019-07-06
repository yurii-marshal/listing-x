import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { ExpirationLinkComponent } from './expiration-link/expiration-link.component';

const routes: Routes = [
  {
    path: '404',
    component:  PageNotFoundComponent
  }, {
    path: 'forbidden',
    component: ForbiddenPageComponent,
    canActivate: [AuthGuardService],
  }, {
    path: 'expired',
    component: ExpirationLinkComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class ErrorsRoutingModule { }
