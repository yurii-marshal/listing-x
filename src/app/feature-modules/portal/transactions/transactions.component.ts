import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import {filter, map, takeUntil} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { CalendarEvent, Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Person } from '../../../core-modules/models/offer';
import * as _ from 'lodash';
import { OfferService } from '../services/offer.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnDestroy, OnInit, AfterViewInit {
  private onDestroyed$: Subject<void> = new Subject<void>();
  /* TODO: add 'lastLogs' column, when api will be ready */
  displayedColumns: string[] = ['createdAt', 'address', 'moderatorBuyers', 'moderatorSellers',
                                'buyers', 'sellers', 'status', 'actions'];

  dataSource: BaseTableDataSource<Transaction>;

  Status = TransactionStatus;
  statuses: string[] = Object.values(TransactionStatus);

  calendarDataSource: CalendarEvent[];

  constructor(private router: Router,
              private service: TransactionService,
              private offerService: OfferService,
              private authService: AuthService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.service.loadCalendar()
      .subscribe(events => this.calendarDataSource = events);

    /* TODO: waiting for endpoint */
    this.dataSource = new BaseTableDataSource(this.service, null, null);
  }

  ngAfterViewInit(): void {
    this.offerService.offerChanged.pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(() => {
      this.dataSource.reload();
    });
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

  onFilter(status: TransactionStatus) {
    let query = `status=${status}`;
    if (status === TransactionStatus.All) {
      query = '';
    }
    this.dataSource.filter = query;
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

  isCurrentUser(item: Person): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      return false;
    }
    return currentUser.firstName === item.firstName && currentUser.lastName === item.lastName;
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
