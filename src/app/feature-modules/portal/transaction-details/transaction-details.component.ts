import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { CalendarEvent, Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { map, switchMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { ConfirmationBarComponent } from '../../../shared-modules/components/confirmation-bar/confirmation-bar.component';
import { CalendarView } from '../../../shared-modules/components/calendar/calendar.component';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  transaction: Transaction;

  calendarDataSource: CalendarEvent[];

  isOpenInviteUserOverlay: boolean;

  userEmailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);

  CalendarView = CalendarView;

  constructor(private route: ActivatedRoute,
              private transactionService: TransactionService,
              private snackbar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit() {
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.loadOne(transactionId)
      .pipe(tap(data => console.log('data: ', data)))
      .subscribe((transaction: Transaction) => this.transaction = transaction);

    this.transactionService.loadCalendarByTransaction(transactionId)
      .subscribe(items => this.calendarDataSource = items);
  }

  onDelete() {
    // TODO: refactor to common CRUD abstract service
    const config = {
      data: {
        message: 'Are you sure want to delete?',
        dismiss: 'Cancel'
      }
    };
    const snackBarRef = this.snackbar.openFromComponent(ConfirmationBarComponent, config);
    snackBarRef.onAction()
      .pipe(
        switchMap(() => this.transactionService.delete(this.transaction.id)),
        tap(() => this.snackbar.open('Successfully deleted item.'))
      )
      .subscribe(() => this.router.navigate(['/portal']));
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
        return 'green';
    }
  }

  inviteUser() {
    this.isOpenInviteUserOverlay = false;
    const email: string = this.userEmailControl.value;
    this.transactionService.inviteUser(email)
      .subscribe(() => this.snackbar.open(`Invite sent to email: ${email}`));
  }
}
