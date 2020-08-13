import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuardService } from '../../core-modules/guards/auth-guard.service';
import { DialogsWrapperComponent } from '../../shared-modules/components/dialogs-wrapper/dialogs-wrapper.component';
import { WriteOfferDialogComponent } from '../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { OfferResolver } from './resolvers/offer.resolver';
import {
  WriteOfferStepTwoDialogComponent
} from '../../shared-modules/dialogs/write-offer-step-two-dialog/write-offer-step-two-dialog.component';
import {
  WriteOfferUploadDocumentsDialogComponent
} from '../../shared-modules/dialogs/write-offer-upload-documents-dialog/write-offer-upload-documents-dialog.component';
import { WriteOfferSummaryComponent } from '../../shared-modules/dialogs/write-offer-summary/write-offer-summary.component';
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
import { SingleCOComponent } from './counter-offer/single-co/single-co.component';
import { MultipleCOComponent } from './counter-offer/multiple-co/multiple-co.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementsListComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'offer', // Dialogs
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: DialogsWrapperComponent,
            data: {component: WriteOfferDialogComponent, isAnonymousCreation: true},
            resolve: {model: CreateOfferResolver}
          }, {
            path: ':id',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: DialogsWrapperComponent,
                data: {component: WriteOfferDialogComponent},
                resolve: {model: OfferResolver},
              }, {
                path: 'step-2',
                component: DialogsWrapperComponent,
                data: {component: WriteOfferStepTwoDialogComponent},
                resolve: {model: OfferResolver}
              }, {
                path: 'upload',
                component: DialogsWrapperComponent,
                data: {
                  component: WriteOfferUploadDocumentsDialogComponent,
                  modalType: UploadDocsModalType.OfferCreation
                },
                resolve: {model: OfferDocumentsResolver}
              }, {
                path: 'summary',
                component: DialogsWrapperComponent,
                data: {component: WriteOfferSummaryComponent},
                resolve: {model: OfferSummaryResolver}
              }
            ]
          }
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
    ]
  },
  {
    path: 'counter-offer',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'single',
        pathMatch: 'full',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: SingleCOComponent,
          },
          {
            path: ':id',
            pathMatch: 'full',
            component: SingleCOComponent,
          }
        ]
      },
      {
        path: 'multiple',
        pathMatch: 'full',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: MultipleCOComponent,
          },
          {
            path: ':id',
            pathMatch: 'full',
            component: MultipleCOComponent,
          }
        ]
      },
    ],
  }, {
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
            canActivate: [CreateOfferGuardService],
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
            pathMatch: 'full',
            component: AgreementDetailsComponent,
            canActivate: [],
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
            resolve: {model: OfferDocumentsResolver}
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
