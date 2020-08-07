import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { filter, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Person } from '../../../core-modules/models/offer';
import { OfferService } from '../services/offer.service';
import { Subject } from 'rxjs';
import { User } from '../../auth/models';
import { CalendarEvent } from '../../../core-modules/models/calendar-event';
import { Agreement, AgreementStatus } from 'src/app/core-modules/models/agreement';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnDestroy, OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'createdAt',
    'address',
    'agentBuyers',
    'agentSellers',
    'buyers',
    'sellers',
    'status',
    'lastLogs',
    'actions',
  ];
  dataSource: BaseTableDataSource<Transaction | Agreement>;
  statuses: string[];
  calendarDataSource: CalendarEvent[];
  user: User;
  transactionsFlow: boolean;
  /* TODO: Refactor */
  readonly transactionStatusLabels: { [key: string]: string } = {
    [TransactionStatus.All]: 'All transactions',
    [TransactionStatus.New]: 'New',
    [TransactionStatus.InProgress]: 'In progress',
    [TransactionStatus.Finished]: 'Finished'
  };
  readonly agreementStatusLabels: { [key: string]: string } = {
    [AgreementStatus.All]: 'All agreements',
    [AgreementStatus.Started]: 'Started',
    [AgreementStatus.Delivered]: 'Delivered',
    [AgreementStatus.Accepted]: 'Accepted',
    [AgreementStatus.Completed]: 'Completed',
    [AgreementStatus.Denied]: 'Denied',
  };
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: TransactionService,
              private offerService: OfferService,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  get Status() {
    return this.transactionsFlow ? TransactionStatus : AgreementStatus;
  }

  ngOnInit() {
    // this.service.loadCalendar()
    //   .subscribe(events => this.calendarDataSource = events);
    this.user = this.authService.currentUser;
    this.transactionsFlow = this.route.snapshot.data.transactionPage ? this.route.snapshot.data.transactionPage : false;
    this.statuses = this.transactionsFlow ? Object.values(TransactionStatus) : Object.values(AgreementStatus);
    this.dataSource = this.transactionsFlow ?
      new BaseTableDataSource(this.service, null, null) :
      new BaseTableDataSource(this.offerService, null, null);
  }

  ngAfterViewInit(): void {
    this.offerService.offerChanged$.pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(() => {
      this.dataSource.reload();
    });
  }

  openOfferFlow() {
    this.offerService.currentOffer = null;
    this.router.navigate(['/portal/purchase-agreements/step-one']);
  }

  openCreateAddressDialog() {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {verbose: true}
    });

    dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult))
      .subscribe();
  }

  onFilter(status: TransactionStatus | AgreementStatus) {
    let query = `status=${status}`;
    if (status === TransactionStatus.All || status === AgreementStatus.All) {
      query = '';
    }
    this.dataSource.filter = query;
  }

  getClassName(status: TransactionStatus | AgreementStatus): string {
    switch (status) {
      case TransactionStatus.New:
        return 'blue';
      case TransactionStatus.InProgress:
        return 'yellow';
      case TransactionStatus.Finished:
        return 'green';
      case AgreementStatus.Started:
        return 'blue';
      case AgreementStatus.Delivered:
        return 'orange';
      case AgreementStatus.Accepted:
        return 'yellow';
      case AgreementStatus.Completed:
        return 'violet';
      case AgreementStatus.Denied:
        return 'red';
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
