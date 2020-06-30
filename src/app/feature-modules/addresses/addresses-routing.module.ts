import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressesListComponent } from './addresses-list/addresses-list.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { ProfileCompletedGuardService } from '../../core-modules/guards/profile-completed-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AddressesListComponent,
    canActivate: [AuthGuardService, ProfileCompletedGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, ProfileCompletedGuardService]
})
export class AddressesRoutingModule {
}
