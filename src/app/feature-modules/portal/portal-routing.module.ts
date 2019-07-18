import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { DialogsWrapperComponent } from '../../shared-modules/components/dialogs-wrapper/dialogs-wrapper.component';
import { WriteOfferDialogComponent } from '../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { OfferResolver } from '../../core-modules/resolvers/offer.resolver';
import { WriteOfferStepTwoDialogComponent } from '../../shared-modules/dialogs/write-offer-step-two-dialog/write-offer-step-two-dialog.component';
import { WriteOfferUploadDocumentsDialogComponent } from '../../shared-modules/dialogs/write-offer-upload-documents-dialog/write-offer-upload-documents-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'step-1',
        component: DialogsWrapperComponent,
        data: { component: WriteOfferDialogComponent, next: '/portal/step-2'},
        resolve: { model: OfferResolver }
      }, {
        path: 'step-2',
        component: DialogsWrapperComponent,
        data: { component: WriteOfferStepTwoDialogComponent},
        resolve: { model: OfferResolver }
      }, {
        path: 'upload',
        component: DialogsWrapperComponent,
        data: { component: WriteOfferUploadDocumentsDialogComponent},
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
