import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { PortalRoutingModule } from './portal-routing.module';
import { MatButtonModule, MatCheckboxModule, MatTableModule, MatTabsModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';
import { RouterModule } from '@angular/router';

const MatModules = [
  MatCheckboxModule,
  MatButtonModule,
  MatTabsModule,
  MatTableModule
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
  ]
})
export class PortalModule { }
