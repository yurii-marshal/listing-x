import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseTableDataSource } from '../../../../core-modules/datasources/base-table-data-source';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { OfferService } from '../../services/offer.service';
import { User } from '../../../auth/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { MatDialog } from '@angular/material';
import { AddressDialogComponent } from '../../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { Person } from '../../../../core-modules/models/offer';
import { CalendarEvent } from '../../../../core-modules/models/calendar-event';
import { Agreement, AgreementStatus } from '../../../../core-modules/models/agreement';

@Component({
  selector: 'app-agreements-list',
  templateUrl: './agreements-list.component.html',
  styleUrls: ['./agreements-list.component.scss']
})
export class AgreementsListComponent implements OnInit, AfterViewInit, OnDestroy {
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
  dataSource: BaseTableDataSource<Agreement>;
  statuses: string[] = Object.values(AgreementStatus);
  calendarDataSource: CalendarEvent[] = [];
  user: User;
  transactionsFlow: boolean;

  readonly statusLabels: { [key: string]: string } = {
    [AgreementStatus.All]: 'All agreements',
    [AgreementStatus.Started]: 'Started',
    [AgreementStatus.Delivered]: 'Delivered',
    [AgreementStatus.Countered]: 'Countered',
    [AgreementStatus.Completed]: 'Completed',
    [AgreementStatus.Denied]: 'Denied',
  };
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              public offerService: OfferService,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  get Status() {
    return AgreementStatus;
  }

  ngOnInit() {
    this.transactionsFlow = this.router.url.includes('transaction');
    this.user = this.authService.currentUser;
    this.dataSource = new BaseTableDataSource(this.offerService, null, null);
    // TODO: add calendar endpoint for agreement flow
    // this.offerService.loadCalendar()
    //   .pipe(takeUntil(this.onDestroyed$))
    //   .subscribe(events => this.calendarDataSource = events);
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

  onFilter(status: AgreementStatus) {
    let query = `status=${status}`;
    if (status === AgreementStatus.All) {
      query = '';
    }
    this.dataSource.filter = query;
  }

  getClassName(status: AgreementStatus): string {
    switch (status) {
      case AgreementStatus.Started:
        return 'blue';
      case AgreementStatus.Delivered:
        return 'orange';
      case AgreementStatus.Countered:
        return 'turquoise';
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
