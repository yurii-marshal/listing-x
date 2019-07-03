import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardService } from './core-modules/guards/login-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'portal'
  }, {
    path: 'auth',
    loadChildren: () => import('./feature-modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [LoginGuardService]
  }, {
    path: 'portal',
    loadChildren: () => import('./feature-modules/portal/portal.module').then(m => m.PortalModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoginGuardService]
})
export class AppRoutingModule {
}
