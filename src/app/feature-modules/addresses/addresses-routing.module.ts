import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressesListComponent } from './addresses-list/addresses-list.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { AgentAllowedGuardService } from '../../core-modules/guards/agent-allowed-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AddressesListComponent,
    canActivate: [AuthGuardService, AgentAllowedGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, AgentAllowedGuardService]
})
export class AddressesRoutingModule {
}
