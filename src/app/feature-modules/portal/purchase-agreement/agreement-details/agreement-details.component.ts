import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { CalendarEvent, Transaction, TransactionStatus } from '../../../../core-modules/models/transaction';
import { FormControl, Validators } from '@angular/forms';
import { AddendumData, Document, GeneratedDocument } from '../../../../core-modules/models/document';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { flatMap, map, takeUntil } from 'rxjs/operators';
import { GeneratedDocumentType } from '../../../../core-modules/enums/upload-document-type';
import { DocumentStatus } from '../../../../core-modules/enums/document-status';
import { Person } from '../../../../core-modules/models/offer';
import { SpqDialogComponent } from '../../dialogs/spq-dialog/spq-dialog.component';
import { AddendumDialogComponent } from '../../dialogs/addendum-dialog/addendum-dialog.component';

@Component({
  selector: 'app-agreement-details',
  templateUrl: './agreement-details.component.html',
  styleUrls: ['./agreement-details.component.scss']
})
export class AgreementDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private onDestroyed$: Subject<void> = new Subject<void>();
  transaction: Transaction;

  calendarDataSource: CalendarEvent[];

  isOpenInviteUserOverlay: boolean;
  isResidentialAgreementCompleted: boolean = false;

  userEmailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);

  isAgent: boolean = false;
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

    const {agentBuyers, agentSellers, sellers} = transaction.offer;
    this.isAgent = [...agentSellers, ...agentBuyers].some(({email}) => email === this.authService.currentUser.email);
    this.isSeller = [...agentSellers, ...sellers].some(({email}) => email === this.authService.currentUser.email);

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
    const email: string = this.userEmailControl.value.toLowerCase();
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.inviteUser(transactionId, email)
      .subscribe(() => {
        this.snackbar.open(`Invite sent to email: ${email}`);
        if (!this.isAgent) {
          return;
        }

        const invited = {
          email,
          firstName: '<Invited',
          lastName: this.isSeller ? `Listing Agent>` : `Buyer's Agent>`
        } as Person;

        const updatedListKey = this.isSeller ? 'agentSellers' : 'agentBuyers';
        this.transaction.offer[updatedListKey].push(invited);
        this.userEmailControl.setValue(null);
      });
  }

  goToESign(doc: GeneratedDocument): void {
    const url = {
      [GeneratedDocumentType.Contract]: '/e-sign',
      [GeneratedDocumentType.Spq]: '/e-sign/spq',
      [GeneratedDocumentType.Addendum]: '/e-sign/addendum'
    }[doc.documentType];

    if (doc.documentType === GeneratedDocumentType.Spq && !this.isAgent && this.isSeller) {
      this.openSPQDialog(doc, true);
      return;
    }

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

  /*downloadAndToggleState(file: string | Document) {
    const id: number = Number(this.route.snapshot.params.id);
    this.transactionService.toggleState(id).subscribe();
    this.triggerDownloadFile(file);
  }*/

  triggerDownloadFile(doc: GeneratedDocument | Document) {
    this.transactionService.documentOpenedEvent(doc.id).subscribe();

    let {file, title} = doc;

    const trigger: HTMLAnchorElement = document.createElement('a');
    if (file.startsWith('/')) {
      let {origin} = window.location;

      if (origin.includes(':4200')) {
        origin = origin.replace(':4200', ':8000');
      }

      file = `${origin}${file}`;
    }
    trigger.href = file;
    trigger.download = title;
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

  openSPQDialog(doc: GeneratedDocument, signAfterFill: boolean = false): void {
    this.dialog.open(SpqDialogComponent, {
      width: '600px',
      data: {
        ...doc.documentData,
        docId: doc.id,
        signAfterFill
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
