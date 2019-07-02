import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardService } from './core-modules/guards/login-guard.service';

const routes: Routes = [
  // TODO: default route with resolver {},
  {
    path: 'auth',
    loadChildren: () => import('./feature-modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [LoginGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoginGuardService]
})
export class AppRoutingModule { }
