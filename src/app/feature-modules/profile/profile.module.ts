import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SharedModule } from '../../shared-modules/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { MatButtonModule, MatSnackBarModule } from '@angular/material';

const MatModules = [
  MatButtonModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    ...MatModules,
  ]
})
export class ProfileModule { }
