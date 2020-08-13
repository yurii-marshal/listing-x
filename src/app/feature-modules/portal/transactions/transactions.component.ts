import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { filter, map, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Offer, Person } from '../../../core-modules/models/offer';
import { OfferService } from '../services/offer.service';
import { Subject } from 'rxjs';
import { User } from '../../auth/models';
import { CalendarEvent } from '../../../core-modules/models/calendar-event';
import { AgreementStatus } from 'src/app/core-modules/models/agreement';
import { BaseDataService } from 'src/app/core-modules/base-classes/base-data-service';
import { log } from 'util';

@Component({
  selector: 'app-transactions',
  templateUrl: '../purchase-agreement/agreements-list/agreements-list.component.html',
  styleUrls: ['../purchase-agreement/agreements-list/agreements-list.component.scss']
})
export class TransactionsComponent implements OnDestroy, OnInit {
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
  dataSource: Offer[];
  catchedDataSourse: Offer[];
  statuses: string[] = Object.values(TransactionStatus);
  calendarDataSource: CalendarEvent[];
  user: User;
  transactionsFlow: boolean;
  /* TODO: Refactor */
  readonly statusLabels: { [key: string]: string } = {
    [TransactionStatus.All]: 'All transactions',
    [TransactionStatus.New]: 'New',
    [TransactionStatus.InProgress]: 'In progress',
    [TransactionStatus.Finished]: 'Finished'
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
    return TransactionStatus;
  }

  ngOnInit() {
    // this.service.loadCalendar()
    //   .subscribe(events => this.calendarDataSource = events);
    this.user = this.authService.currentUser;
    this.transactionsFlow = this.router.url.includes('transaction');
    this.service.loadList().pipe(
      takeUntil(this.onDestroyed$),
      map((resp: any) => {
        return resp.results.map(transaction => {
          return {...transaction.offer, status: transaction.status};
        });
      })
    )
      .subscribe(offer => {
        this.catchedDataSourse = offer;
        this.dataSource = offer;
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
  // TODO: filter by params in GET query
  onFilter(status) {
    if (status === TransactionStatus.All) {
      this.dataSource = Object.assign(this.catchedDataSourse);
      return;
    }

    this.dataSource = this.catchedDataSourse.filter(element => element.status === status);
  }

  getClassName(status: TransactionStatus | AgreementStatus): string {
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
