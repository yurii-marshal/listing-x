import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { PortalRoutingModule } from './portal-routing.module';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule, MatNativeDateModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';
import { RouterModule } from '@angular/router';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionService } from './services/transaction.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { SpqDialogComponent } from './dialogs/spq-dialog/spq-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { AddendumDialogComponent } from './dialogs/addendum-dialog/addendum-dialog.component';
import { StepOneComponent } from './purchase-agreement/step-one/step-one.component';
import { StepTwoComponent } from './purchase-agreement/step-two/step-two.component';
import { StepThreeComponent } from './purchase-agreement/step-three/step-three.component';
import { SummaryComponent } from './purchase-agreement/summary/summary.component';
import { EditOfferDialogComponent } from '../../shared-modules/dialogs/edit-offer-dialog/edit-offer-dialog.component';
import { SaveOfferDialogComponent } from '../../shared-modules/dialogs/save-offer-dialog/save-offer-dialog.component';
import { AgreementsListComponent } from './purchase-agreement/agreements-list/agreements-list.component';
import { AgreementDetailsComponent } from './purchase-agreement/agreement-details/agreement-details.component';
import { AgreementService } from './services/agreement.service';
import { SingleCOComponent } from './counter-offer/single-co/single-co.component';
import { MultipleCOComponent } from './counter-offer/multiple-co/multiple-co.component';

const MatModules = [
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatTabsModule,
  MatTableModule,
  MatIconModule,
  MatSelectModule,
  MatDialogModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PortalRoutingModule,
    SharedModule,
    OverlayModule,
    ...MatModules,
    MatMenuModule,
  ],
  declarations: [
    TransactionsComponent,
    TransactionDetailsComponent,
    SpqDialogComponent,
    AddendumDialogComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    SummaryComponent,
    AgreementsListComponent,
    AgreementDetailsComponent,
    SingleCOComponent,
    MultipleCOComponent,
  ],
  entryComponents: [
    AddendumDialogComponent,
    EditOfferDialogComponent,
    SaveOfferDialogComponent,
    SpqDialogComponent
  ],
  providers: [
    AgreementService,
    TransactionService,
    MatDatepickerModule
  ],
})
export class PortalModule {
}
