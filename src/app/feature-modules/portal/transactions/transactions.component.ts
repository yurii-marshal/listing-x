import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AddressDialogComponent} from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import {filter, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {BaseTableDataSource} from '../../../core-modules/datasources/base-table-data-source';
import {CalendarEvent, Transaction, TransactionStatus} from '../../../core-modules/models/transaction';
import {TransactionService} from '../services/transaction.service';
import {AuthService} from '../../../core-modules/core-services/auth.service';
import {Person} from '../../../core-modules/models/offer';
import {OfferService} from '../services/offer.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnDestroy, OnInit, AfterViewInit {
  private onDestroyed$: Subject<void> = new Subject<void>();
  displayedColumns: string[] = ['createdAt', 'address', 'moderatorBuyers', 'moderatorSellers',
                                'buyers', 'sellers', 'status', 'lastLogs', 'actions'];

  dataSource: BaseTableDataSource<Transaction>;

  statuses: string[] = Object.values(TransactionStatus);

  calendarDataSource: CalendarEvent[];
  /* TODO: Refactor */
  readonly statusLabels: {[key: string]: string} = {
    [TransactionStatus.All]: 'All transactions',
    [TransactionStatus.New]: 'New',
    [TransactionStatus.InProgress]: 'In progress',
    [TransactionStatus.Finished]: 'Finished'
  };

  get Status() {
    return TransactionStatus;
  }

  constructor(private router: Router,
              private service: TransactionService,
              private offerService: OfferService,
              private authService: AuthService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.service.loadCalendar()
      .subscribe(events => this.calendarDataSource = events);

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
      case TransactionStatus.New:
        return 'blue';
      case TransactionStatus.InProgress:
        return 'yellow';
      case TransactionStatus.Finished:
        return 'green';
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
