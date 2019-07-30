import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { DialogsWrapperComponent } from '../../shared-modules/components/dialogs-wrapper/dialogs-wrapper.component';
import { WriteOfferDialogComponent } from '../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { OfferResolver } from './resolvers/offer.resolver';
import { WriteOfferStepTwoDialogComponent } from '../../shared-modules/dialogs/write-offer-step-two-dialog/write-offer-step-two-dialog.component';
import { WriteOfferUploadDocumentsDialogComponent } from '../../shared-modules/dialogs/write-offer-upload-documents-dialog/write-offer-upload-documents-dialog.component';
import { WriteOfferSummaryComponent } from '../../shared-modules/dialogs/write-offer-summary/write-offer-summary.component';
import { OfferDocumentsResolver } from './resolvers/offer-documents.resolver';
import { AnonymousOfferResolver } from './resolvers/anonymous-offer.resolver';
import { OfferSummaryResolver } from './resolvers/offer-summary.resolver';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'offer', //Dialogs
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: DialogsWrapperComponent,
            data: { component: WriteOfferDialogComponent},
            resolve: {model: AnonymousOfferResolver}
          }, {
            path: ':id',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: DialogsWrapperComponent,
                data: { component: WriteOfferDialogComponent},
                resolve: { model: OfferResolver },
              }, {
                path: 'step-2',
                component: DialogsWrapperComponent,
                data: { component: WriteOfferStepTwoDialogComponent},
                resolve: { model: OfferResolver }
              }, {
                path: 'upload',
                component: DialogsWrapperComponent,
                data: { component: WriteOfferUploadDocumentsDialogComponent},
                resolve: { model:  OfferDocumentsResolver}
              }, {
                path: 'summary',
                component: DialogsWrapperComponent,
                data: { component: WriteOfferSummaryComponent},
                resolve: { model: OfferSummaryResolver }
              }
            ]
          }
        ]
      }, {
        path: 'upload',
        component: DialogsWrapperComponent,
        data: { component: WriteOfferUploadDocumentsDialogComponent, readonly: true},
      }
    ]
  }, {
    path: 'transaction/:id',
    component: TransactionDetailsComponent,
    canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService,
    OfferResolver,
    AnonymousOfferResolver,
    OfferDocumentsResolver,
    OfferSummaryResolver
  ]
})
export class PortalRoutingModule { }
