import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuardService } from './core-modules/guards/login-guard.service';
import { ActivationResolver } from './core-modules/resolvers/activation.resolver';
import { ProfileGuardService } from './core-modules/guards/profile-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  }, {
    path: 'auth',
    loadChildren: () => import('./feature-modules/auth/auth.module').then(m => m.AuthModule),
  }, {
    path: 'profile',
    loadChildren: () => import('./feature-modules/profile/profile.module').then(m => m.ProfileModule),
  }, {
    path: 'portal',
    loadChildren: () => import('./feature-modules/portal/portal.module').then(m => m.PortalModule),
  }, {
    path: 'addresses',
    loadChildren: () => import('./feature-modules/addresses/addresses.module').then(m => m.AddressesModule),
  }, {
    path: 'error',
    loadChildren: () => import('./feature-modules/errors/errors.module').then(m => m.ErrorsModule),
  }, {
    path: 'address-generated-link',
    loadChildren: () => import('./feature-modules/anonymous/anonymous.module').then(m => m.AnonymousModule),
  }, {
    path: 'e-sign',
    loadChildren: () => import('./feature-modules/digital-signature/digital-signature.module').then(m => m.DigitalSignatureModule),
  }, {
    path: '**',
    redirectTo: '/error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
  })],
  exports: [RouterModule],
  providers: [
    LoginGuardService,
    ProfileGuardService,
    ActivationResolver
  ]
})
export class AppRoutingModule {
}
