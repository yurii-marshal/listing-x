import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { DialogsWrapperComponent } from '../../shared-modules/components/dialogs-wrapper/dialogs-wrapper.component';
import { OfferResolver } from './resolvers/offer.resolver';
import {
  WriteOfferUploadDocumentsDialogComponent
} from '../../shared-modules/dialogs/write-offer-upload-documents-dialog/write-offer-upload-documents-dialog.component';
import { OfferDocumentsResolver } from './resolvers/offer-documents.resolver';
import { CreateOfferResolver } from './resolvers/create-offer-resolver';
import { OfferSummaryResolver } from './resolvers/offer-summary.resolver';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { UploadDocsModalType } from '../../core-modules/enums/upload-docs-modal-type';
import { StepOneComponent } from './purchase-agreement/step-one/step-one.component';
import { StepTwoComponent } from './purchase-agreement/step-two/step-two.component';
import { StepThreeComponent } from './purchase-agreement/step-three/step-three.component';
import { SummaryComponent } from './purchase-agreement/summary/summary.component';
import { CreateOfferGuardService } from '../../core-modules/guards/create-offer-guard.service';
import { GetOfferResolver } from '../../core-modules/resolvers/get-offer.resolver';
import { AgreementsListComponent } from './purchase-agreement/agreements-list/agreements-list.component';
import { AgreementDetailsComponent } from './purchase-agreement/agreement-details/agreement-details.component';
import { TransactionDocumentsResolver } from 'src/app/feature-modules/portal/resolvers/transaction-documents.resolver';
import { MultipleCOComponent } from './counter-offer/multiple-co/multiple-co.component';
import { BuyerCOAgreementComponent } from './counter-offer/single-co/buyer-co-agreement/buyer-co-agreement.component';
import { SellerCOAgreementComponent } from './counter-offer/single-co/seller-co-agreement/seller-co-agreement.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementsListComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: []
  },
  {
    path: 'offer', // Dialogs
    children: [
      {
        path: ':offerId',
        children: [
          // {
          //   path: '',
          //   pathMatch: 'full',
          //   component: DialogsWrapperComponent,
          //   data: {component: WriteOfferDialogComponent},
          //   resolve: {model: OfferResolver},
          // }, {
          //   path: 'step-2',
          //   component: DialogsWrapperComponent,
          //   data: {component: WriteOfferStepTwoDialogComponent},
          //   resolve: {model: OfferResolver}
          // }, {
          //   path: 'upload',
          //   component: DialogsWrapperComponent,
          //   data: {
          //     component: WriteOfferUploadDocumentsDialogComponent,
          //     modalType: UploadDocsModalType.OfferCreation
          //   },
          //   resolve: {model: OfferDocumentsResolver}
          // }, {
          //   path: 'summary',
          //   component: DialogsWrapperComponent,
          //   data: {component: WriteOfferSummaryComponent},
          //   resolve: {model: OfferSummaryResolver}
          // },
          {
            path: 'counter-offers',
            canActivate: [AuthGuardService],
            canActivateChild: [AuthGuardService],
            children: [
              {
                path: ':id/seller',
                pathMatch: 'full',
                component: SellerCOAgreementComponent,
              },
              {
                path: ':id/buyer',
                pathMatch: 'full',
                component: BuyerCOAgreementComponent,
              },
              {
                path: ':id/multiple',
                pathMatch: 'full',
                component: MultipleCOComponent,
              },
            ],
          },
        ]
      },
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   component: DialogsWrapperComponent,
      //   data: {component: WriteOfferDialogComponent, isAnonymousCreation: true},
      //   resolve: {model: CreateOfferResolver}
      // },
    ]
  }, {
    path: 'upload',
    component: DialogsWrapperComponent,
    data: {
      component: WriteOfferUploadDocumentsDialogComponent,
      modalType: UploadDocsModalType.Upload
      // readonly: true
    },
  },
  {
    path: 'purchase-agreements',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'all',
        pathMatch: 'full',
        component: AgreementsListComponent,
      },
      {
        path: 'step-one',
        pathMatch: 'full',
        component: StepOneComponent,
        canActivate: [],
        resolve: {offer: CreateOfferResolver}
      },
      {
        path: ':id',
        children: [
          {
            path: 'step-one',
            pathMatch: 'full',
            component: StepOneComponent,
            canActivate: [CreateOfferGuardService],
            data: {progress: 1},
            resolve: {offer: GetOfferResolver}
          },
          {
            path: 'step-two',
            pathMatch: 'full',
            component: StepTwoComponent,
            canActivate: [],
            data: {progress: 2},
            resolve: {offer: GetOfferResolver}
          },
          {
            path: 'step-three',
            pathMatch: 'full',
            component: StepThreeComponent,
            canActivate: [],
            data: {progress: 3},
            resolve: {offer: GetOfferResolver}
          },
          {
            path: 'summary',
            pathMatch: 'full',
            component: SummaryComponent,
            canActivate: [],
            data: {progress: 4},
            resolve: {offer: GetOfferResolver}
          },
          {
            path: 'details',
            component: AgreementDetailsComponent,
            canActivate: [],
            children: [
              {
                path: 'upload',
                component: DialogsWrapperComponent,
                data: {
                  component: WriteOfferUploadDocumentsDialogComponent,
                  modalType: UploadDocsModalType.OfferUpdating,
                  transactionPage: false
                },
                resolve: {model: OfferDocumentsResolver}
              },
            ]
          },
          {
            path: 'sign',
            pathMatch: 'full',
            component: StepTwoComponent,
            resolve: {offer: GetOfferResolver}
          },
        ]
      },
    ]
  },
  {
    path: 'transactions',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: '',
        component: TransactionsComponent,
      },
      {
        path: ':id',
        component: TransactionDetailsComponent,
        children: [
          {
            path: 'upload',
            component: DialogsWrapperComponent,
            data: {
              component: WriteOfferUploadDocumentsDialogComponent,
              modalType: UploadDocsModalType.OfferUpdating,
              transactionPage: true
            },
            resolve: {model: TransactionDocumentsResolver}
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService,
    CreateOfferGuardService,
    OfferResolver,
    CreateOfferResolver,
    GetOfferResolver,
    OfferDocumentsResolver,
    TransactionDocumentsResolver,
    OfferSummaryResolver
  ]
})
export class PortalRoutingModule {
}
