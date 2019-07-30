import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { Address } from '../../../core-modules/models/address';
import { Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['createdAt', 'address', 'buyers', 'sellers', 'status', 'lastEvents', 'actions'];

  dataSource: BaseTableDataSource<Transaction>;

  Status = TransactionStatus;

  constructor(private router: Router,
              private dialog: MatDialog,
              private service: TransactionService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.dataSource = new BaseTableDataSource(this.service, null, null);
    this.cdr.detectChanges();
  }

  onSubmit() {
  }

  openCreateAddressDialog() {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {verbose: true}
    });

    dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult),)
      .subscribe();
  }

  getClassName(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.Started:
        return 'blue';
      case TransactionStatus.InReview:
        return 'yellow';
      case TransactionStatus.Denied:
        return 'red';
      case TransactionStatus.Accepted:
      case TransactionStatus.Completed:
        return  'green';
    }
  }
}
