import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarEvent, Transaction, TransactionStatus } from '../../../../core-modules/models/transaction';
import { BaseTableDataSource } from '../../../../core-modules/datasources/base-table-data-source';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { OfferService } from '../../services/offer.service';
import { User } from '../../../auth/models';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { MatDialog } from '@angular/material';
import { AddressDialogComponent } from '../../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { Person } from '../../../../core-modules/models/offer';

@Component({
  selector: 'app-agreements-list',
  templateUrl: './agreements-list.component.html',
  styleUrls: ['./agreements-list.component.scss']
})
export class AgreementsListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['createdAt', 'address', 'agentBuyers', 'agentSellers',
    'buyers', 'sellers', 'status', 'lastLogs', 'actions'];
  dataSource: BaseTableDataSource<Transaction>;
  statuses: string[] = Object.values(TransactionStatus);
  calendarDataSource: CalendarEvent[];
  user: User;
  /* TODO: Refactor */
  readonly statusLabels: { [key: string]: string } = {
    [TransactionStatus.All]: 'All agreements',
    [TransactionStatus.New]: 'New',
    [TransactionStatus.InProgress]: 'In progress',
    [TransactionStatus.Finished]: 'Finished'
  };
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private router: Router,
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
    this.dataSource = new BaseTableDataSource(this.service, null, null);
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
    this.router.navigate(['/portal/purchase-agreement/step-one']);
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
