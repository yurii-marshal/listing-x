import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { CalendarEvent, Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  transaction: Transaction;

  calendarDataSource: CalendarEvent[];

  isOpenInviteUserOverlay: boolean;

  userEmailControl: FormControl;

  constructor(private route: ActivatedRoute,
              private transactionService: TransactionService,
              private snackbar: MatSnackBar) { }

  ngOnInit() {
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.loadOne(transactionId)
      .subscribe((transaction: Transaction) => this.transaction = transaction);

    this.transactionService.loadCalendarByTransaction(transactionId)
      .subscribe(items => this.calendarDataSource = items);

    this.userEmailControl = new FormControl(null, [Validators.required, Validators.email]);
  }

  onDelete() {}

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

  inviteUser() {
    this.isOpenInviteUserOverlay = true;
    const email: string = this.userEmailControl.value;
    this.transactionService.inviteUser(email)
      .subscribe(() => this.snackbar.open(`Invite sent to email: ${email}`))
  }
}
