import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { DialogsWrapperComponent } from '../../shared-modules/components/dialogs-wrapper/dialogs-wrapper.component';
import { WriteOfferDialogComponent } from '../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { OfferResolver } from '../../core-modules/resolvers/offer.resolver';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'step-1',
        component: DialogsWrapperComponent,
        data: { component: WriteOfferDialogComponent, next: '/portal/step-2'},
        resolve: { model: OfferResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService, OfferResolver]
})
export class PortalRoutingModule { }
