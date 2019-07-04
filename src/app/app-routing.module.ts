import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardService } from './core-modules/guards/login-guard.service';
import { ActivationResolver } from './core-modules/resolvers/activation.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'portal'
  }, {
    path: 'auth',
    loadChildren: () => import('./feature-modules/auth/auth.module').then(m => m.AuthModule),
  }, {
    path: 'portal',
    loadChildren: () => import('./feature-modules/portal/portal.module').then(m => m.PortalModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    LoginGuardService,
    ActivationResolver
  ]
})
export class AppRoutingModule {
}
