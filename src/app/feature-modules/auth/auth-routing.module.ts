import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { LoginGuardService } from '../../core-modules/guards/login-guard.service';
import { ActivationResolver } from '../../core-modules/resolvers/activation.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  }, {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuardService]
  }, {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'reset',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ResetPasswordComponent
      },
      {
        path: ':token',
        component: NewPasswordComponent
      }
    ]
  }, {
    path: 'activation/:token',
    resolve: { activated: ActivationResolver},
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AuthRoutingModule {
}
