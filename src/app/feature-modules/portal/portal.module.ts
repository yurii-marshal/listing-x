import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { PortalRoutingModule } from './portal-routing.module';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatSelectModule, MatTableModule, MatTabsModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';
import { RouterModule } from '@angular/router';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransactionService } from './services/transaction.service';
import { FullCalendarModule } from '@fullcalendar/angular';


const MatModules = [
  MatCheckboxModule,
  MatButtonModule,
  MatTabsModule,
  MatTableModule,
  MatIconModule,
  MatSelectModule
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PortalRoutingModule,
    SharedModule,
    ...MatModules
  ],
  declarations: [
    TransactionsComponent,
    TransactionDetailsComponent,
  ],
  providers: [
    TransactionService
  ]
})
export class PortalModule { }
