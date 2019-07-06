import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { PortalRoutingModule } from './portal-routing.module';
import { MatButtonModule, MatCheckboxModule, MatTabsModule } from '@angular/material';
import { SharedModule } from '../../shared-modules/shared.module';

const MatModules = [
  MatCheckboxModule,
  MatButtonModule,
  MatTabsModule
];

@NgModule({
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    ...MatModules
  ],
  declarations: [
    TransactionsComponent
  ]
})
export class PortalModule { }
