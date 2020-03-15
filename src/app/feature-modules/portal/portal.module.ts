import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { PortalRoutingModule } from './portal-routing.module';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatSelectModule, MatTableModule, MatTabsModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';
import { RouterModule } from '@angular/router';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionService } from './services/transaction.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { SPQDialogComponent } from './dialogs/spqdialog/spqdialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

const MatModules = [
  MatCheckboxModule,
  MatButtonModule,
  // MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatTableModule,
  MatIconModule,
  MatSelectModule,
  MatDialogModule,
  MatRadioModule
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
    SPQDialogComponent,
  ],
  entryComponents: [
    SPQDialogComponent
  ],
  providers: [
    TransactionService
  ],
})
export class PortalModule { }
