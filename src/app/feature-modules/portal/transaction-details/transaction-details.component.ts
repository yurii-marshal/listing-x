import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TransactionService} from '../services/transaction.service';
import {CalendarEvent, Transaction, TransactionStatus} from '../../../core-modules/models/transaction';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {flatMap, map, takeUntil} from 'rxjs/operators';
import {CalendarView} from '../../../shared-modules/components/calendar/calendar.component';
import {AddendumData, Document, GeneratedDocument} from '../../../core-modules/models/document';
import {AuthService} from '../../../core-modules/core-services/auth.service';
import {Observable, of, Subject} from 'rxjs';
import {DocumentStatus} from '../../../core-modules/enums/document-status';
import {Person} from '../../../core-modules/models/offer';
import {GeneratedDocumentType} from '../../../core-modules/enums/upload-document-type';
import {MatDialog} from '@angular/material/dialog';
import {SpqDialogComponent} from '../dialogs/spq-dialog/spq-dialog.component';
import {AddendumDialogComponent} from '../dialogs/addendum-dialog/addendum-dialog.component';

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
  isResidentialAgreementCompleted: boolean = false;

  userEmailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);

  CalendarView = CalendarView;

  isModerator: boolean = false;
  isSeller: boolean = false;

  pendingDocuments: Observable<GeneratedDocument[]>;
  completedDocuments: Observable<GeneratedDocument[]>;

  /* TODO: Refactor */
  readonly statusLabels: {[key: string]: string} = {
    [TransactionStatus.All]: 'All transactions',
    [TransactionStatus.New]: 'New',
    [TransactionStatus.InProgress]: 'In progress',
    [TransactionStatus.Finished]: 'Finished'
  };

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private snackbar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit() {
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.loadOne(transactionId)
      .subscribe((transaction: Transaction) => this.transactionLoaded(transaction));

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
    ).subscribe((transaction) => this.transactionLoaded(transaction));
  }

  transactionLoaded(transaction: Transaction): void {
    this.transaction = transaction;

    const {moderatorBuyers, moderatorSellers, sellers} = transaction.offer;
    this.isModerator = [...moderatorSellers, ...moderatorBuyers].some(({email}) => email === this.authService.currentUser.email);
    this.isSeller = [...moderatorSellers, ...sellers].some(({email}) => email === this.authService.currentUser.email);

    const residentialAgreement = transaction.documents.find(doc => doc.documentType === GeneratedDocumentType.Contract);
    this.isResidentialAgreementCompleted = residentialAgreement && residentialAgreement.status === DocumentStatus.Completed;

    this.filterDocumentList(transaction.documents);
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

  goToESign(doc: GeneratedDocument): void {
    const url = {
      [GeneratedDocumentType.Contract]: '/e-sign',
      [GeneratedDocumentType.Spq]: '/e-sign/spq',
      [GeneratedDocumentType.Addendum]: '/e-sign/addendum'
    }[doc.documentType];

    this.router.navigate([url, doc.id]);
    // this.transactionService.lockOffer(this.transaction.id)
    //   .subscribe(() => this.router.navigate(['/e-sign', this.transaction.id]));
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
      if (file.startsWith('/')) {
        file = `${window.location.origin}${file}`;
      }
      trigger.href = trigger.download = file;
    } else {
      trigger.href = file.file;
      trigger.download = file.title;
    }
    trigger.target = '_blank';
    trigger.click();
  }

  private filterDocumentList(documents: GeneratedDocument[]): void {
    /**
     * contract status = STARTED
     * if all buyers signed, contract status = DELIVERED
     * when contract status is DELIVERED , sellers are allowed to sign.
     * (in case are more than one seller and if not all sellers signed , contract status = ACCEPTED.
     * after all sellers signed, contract status = COMPLETED
     */

    const completedDocsStatuses = [DocumentStatus.Completed];

    this.pendingDocuments = of(documents).pipe(
      map((docs) => docs.filter(doc => !completedDocsStatuses.includes(doc.status)))
    );
    this.completedDocuments = of(documents).pipe(
      map((docs) => docs.filter(doc => completedDocsStatuses.includes(doc.status)))
    );
  }

  openSPQDialog(doc: GeneratedDocument): void {
    this.dialog.open(SpqDialogComponent, {
      width: '600px',
      data: {
        ...doc.documentData,
        docId: doc.id
      }
    });
  }

  openAddendumDialog(doc: GeneratedDocument = null): void {
    this.dialog.open(AddendumDialogComponent, {
      width: '600px',
      data: {
        transactionId: this.transaction.id,
        docData: doc ? doc.documentData as AddendumData : null,
        docId: doc ? doc.id : null
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
