import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardService } from './core-modules/guards/login-guard.service';
import { ActivationResolver } from './core-modules/resolvers/activation.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  }, {
    path: 'auth',
    loadChildren: () => import('./feature-modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [LoginGuardService]
  }, {
    path: 'portal',
    loadChildren: () => import('./feature-modules/portal/portal.module').then(m => m.PortalModule),
  }, {
    path: 'addresses',
    // TODO:  prevent access
    loadChildren: () => import('./feature-modules/addresses/addresses.module').then(m => m.AddressesModule),
  }, {
    path: 'error',
    loadChildren: () => import('./feature-modules/errors/errors.module').then(m => m.ErrorsModule),
  }, {
    path: '**',
    redirectTo: '/error/404'
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
