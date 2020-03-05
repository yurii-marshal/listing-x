import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { CalendarEvent, Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import {flatMap, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import * as _ from 'lodash';
import { ConfirmationBarComponent } from '../../../shared-modules/components/confirmation-bar/confirmation-bar.component';
import { CalendarView } from '../../../shared-modules/components/calendar/calendar.component';
import { Document } from '../../../core-modules/models/document';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Subject } from 'rxjs';
import {DocumentStatus} from '../../../core-modules/enums/document-status';
import {Person} from '../../../core-modules/models/offer';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements AfterViewInit, OnDestroy, OnInit {
  private onDestroyed$: Subject<void> = new Subject<void>();
  transaction: Transaction;

  calendarDataSource: CalendarEvent[];

  isOpenInviteUserOverlay: boolean;

  userEmailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);

  CalendarView = CalendarView;

  isModerator: boolean = false;
  isSeller: boolean = false;

  get pendingDocuments() {
    return this.transaction ?
      this.transaction.documents.filter((d) => d.status !== DocumentStatus.Delivered) :
      [];
  }

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private snackbar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit() {
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.loadOne(transactionId)
      .subscribe((transaction: Transaction) => {
        this.transaction = transaction;
        const {moderatorBuyers, moderatorSellers, sellers} = this.transaction.offer;
        this.isModerator = [...moderatorSellers, ...moderatorBuyers].some(({email}) => email === this.authService.currentUser.email);
        this.isSeller = [...moderatorSellers, ...sellers].some(({email}) => email === this.authService.currentUser.email);
      });

    this.transactionService.loadCalendarByTransaction(transactionId)
      .subscribe(items => this.calendarDataSource = items);
  }

  ngAfterViewInit(): void {
    this.transactionService.transactionChanged.pipe(
      takeUntil(this.onDestroyed$),
      flatMap(() => {
        const transactionId: number = Number(this.route.snapshot.params.id);
        return this.transactionService.loadOne(transactionId);
      })
    ).subscribe((transaction) => {
      this.transaction = transaction;
    });
  }

  onDelete() {
    this.transactionService.delete(this.transaction.id)
      .subscribe(() => this.router.navigate(['/portal']));
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

  inviteUser() {
    this.isOpenInviteUserOverlay = false;
    const email: string = this.userEmailControl.value;
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.inviteUser(transactionId, email)
      .subscribe(() => {
        this.snackbar.open(`Invite sent to email: ${email}`);
        if (!this.isModerator) {
          return;
        }

        const invited: Person = {
          email,
          firstName: '<Invited',
          lastName: `Moderator ${this.isSeller ? 'Seller>' : 'Buyer>'}`
        };

        const updatedListKey = this.isSeller ? 'moderatorSellers' : 'moderatorBuyers';
        this.transaction.offer[updatedListKey].push(invited);
      });
  }

  goToESign() {
    this.transactionService.lockOffer(this.transaction.id)
      .subscribe(() => this.router.navigate(['/e-sign', this.transaction.id]));
  }

  deny() {
    const id: number = Number(this.route.snapshot.params.id);
    this.transactionService.deny(id)
      .subscribe(() => {
        this.transaction.allowDeny = false;
        this.snackbar.open(`Denied.`);
      });
  }

  downloadAndToggleState(file: string | Document) {
    const id: number = Number(this.route.snapshot.params.id);
    this.transactionService.toggleState(id).subscribe();
    this.triggerDownloadFile(file);
  }

  triggerDownloadFile(file: string | Document) {
    /* TODO: UPDATE REQUEST DATA */
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.documentOpenedEvent(transactionId).subscribe();

    const trigger: HTMLAnchorElement = document.createElement('a');
    if (typeof file  === 'string') {
      trigger.href = trigger.download = file;
    } else {
      trigger.href = file.file;
      trigger.download = file.title;
    }
    trigger.target = '_blank';
    trigger.click();
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
