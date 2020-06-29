import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatSelectModule, MatTabsModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';
import { NewPasswordComponent } from './new-password/new-password.component';

const MatModules = [
  MatCheckboxModule,
  MatButtonModule,
  MatTabsModule,
  MatSelectModule
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    ...MatModules,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    NewPasswordComponent
  ],
  providers: [

  ]
})
export class AuthModule {
}
