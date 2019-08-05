import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { CalendarEvent, Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { TransactionService } from '../services/transaction.service';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Person } from '../../../core-modules/models/offer';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['createdAt', 'address', 'buyers', 'sellers', 'status', 'lastEvents', 'actions'];

  dataSource: BaseTableDataSource<Transaction>;

  Status = TransactionStatus;

  calendarDataSource: CalendarEvent[];

  calendarHeader = {
    center: 'title',
    left: 'today prev,next',
    right: 'dayGridMonth,timeGridWeek'
  };

  calendarPlugins = [
    dayGridPlugin, // important!
    timeGridPlugin
  ];

  statuses: string[] = Object.values(TransactionStatus);

  @ViewChild('calendar', {static: false})
  calendarComponent: FullCalendarComponent;

  constructor(private router: Router,
              private service: TransactionService,
              private authService: AuthService,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.service.loadCalendar()
      .subscribe(events => this.calendarDataSource = events);
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


}
