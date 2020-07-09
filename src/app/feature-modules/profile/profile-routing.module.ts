import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AgentDataResolver } from '../portal/resolvers/agent-data.resolver';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    canActivate: [AuthGuardService],
    // resolve: {model: AgentDataResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService,
    AgentDataResolver
  ],
})
export class ProfileRoutingModule {
}
