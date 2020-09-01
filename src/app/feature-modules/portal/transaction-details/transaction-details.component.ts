import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { Transaction, TransactionStatus } from '../../../core-modules/models/transaction';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { flatMap, takeUntil, tap } from 'rxjs/operators';
import { AddendumData, Document, GeneratedDocument } from '../../../core-modules/models/document';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Subject } from 'rxjs';
import { Offer, Person } from '../../../core-modules/models/offer';
import { GeneratedDocumentType } from '../../../core-modules/enums/upload-document-type';
import { MatDialog } from '@angular/material/dialog';
import { SpqDialogComponent } from '../dialogs/spq-dialog/spq-dialog.component';
import { AddendumDialogComponent } from '../dialogs/addendum-dialog/addendum-dialog.component';
import { CalendarEvent } from '../../../core-modules/models/calendar-event';
import { OfferService } from 'src/app/feature-modules/portal/services/offer.service';
import { DocumentStatus } from 'src/app/core-modules/enums/document-status';

@Component({
  selector: 'app-transaction-details',
  templateUrl: '../purchase-agreement/agreement-details/agreement-details.component.html',
  styleUrls: ['../purchase-agreement/agreement-details/agreement-details.component.scss']
})
export class TransactionDetailsComponent implements AfterViewInit, OnDestroy, OnInit {
  offer: Offer;

  calendarDataSource: CalendarEvent[];

  isOpenInviteUserOverlay: boolean;
  isResidentialAgreementCompleted: boolean = false;

  userEmailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);

  isAgent: boolean = false;
  isSeller: boolean = false;

  transactionsFlow: boolean;

  readonly statusLabels: {[key: string]: string} = {
    [TransactionStatus.All]: 'All transactions',
    [TransactionStatus.New]: 'New',
    [TransactionStatus.InProgress]: 'In progress',
    [TransactionStatus.Finished]: 'Finished'
  };
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private offerService: OfferService,
              private snackbar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit() {
    this.transactionsFlow = this.router.url.includes('transaction');

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
      }),
      tap(transaction => this.transactionService.notifyAboutSpqUpdated$.next(transaction))
    ).subscribe((transaction) => this.transactionLoaded(transaction));
  }

  transactionLoaded(transaction: Transaction): void {
    this.offer = {
      ...transaction.offer,
      allowDelete: transaction.allowDelete,
      allowDeny: transaction.allowDeny,
      allowEdit: transaction.allowEdit,
      allowInvite: transaction.allowInvite,
      createdAt: transaction.createdAt,
      lastLogs: transaction.lastLogs,
      transactionDocs: transaction.documents,
      status: transaction.status,
      purchaseAgreements: transaction.purchaseAgreements,
      completedDocuments: transaction.completedDocuments,
      pendingDocuments: transaction.pendingDocuments
    };

    const {agentBuyers, agentSellers, sellers} = transaction.offer;
    this.isAgent = [...agentSellers, ...agentBuyers].some(({email}) => email === this.authService.currentUser.email);
    this.isSeller = [...agentSellers, ...sellers].some(({email}) => email === this.authService.currentUser.email);

    const residentialAgreement = transaction.purchaseAgreements.find(doc => doc.documentType === GeneratedDocumentType.Contract);
    this.isResidentialAgreementCompleted = residentialAgreement && residentialAgreement.status === DocumentStatus.Completed;
  }

  offerLoaded(offer: Offer): void {
    this.offer = offer;

    const {agentBuyers, agentSellers, sellers} = offer;
    this.isSeller = [...agentSellers, ...sellers].some(({email}) => email === this.authService.currentUser.email);

    // const residentialAgreement = Array(offer.documents).find(doc => doc.documentType === GeneratedDocumentType.Contract);
    // this.isResidentialAgreementCompleted = residentialAgreement && residentialAgreement.status === DocumentStatus.Completed;
  }

  onDelete() {
    this.transactionService.delete(this.offer.transaction)
      .subscribe(() => this.router.navigate(['/portal/transactions']));
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
        this.offer[updatedListKey].push(invited);
        this.userEmailControl.setValue(null);
      });
  }

  goToESign(doc: GeneratedDocument): void {
    // const url = {
    //   [GeneratedDocumentType.Contract]: '/e-sign',
    //   [GeneratedDocumentType.Spq]: '/e-sign/spq',
    //   [GeneratedDocumentType.Addendum]: '/e-sign/addendum'
    // }[doc.documentType];
    //
    // if (doc.documentType === GeneratedDocumentType.Spq && !this.isAgent && this.isSeller) {
    //   this.openSPQDialog(doc, true);
    //   return;
    // }

    // this.router.navigate([url, doc.id]);
    // this.transactionService.lockOffer(this.offer.transaction)
    //   .subscribe(() => this.router.navigate(['/e-sign', this.offer.transaction]));
  }

  deny() {
    const id: number = Number(this.route.snapshot.params.id);
    this.transactionService.deny(id)
      .subscribe(() => {
        this.offer.allowDeny = false;
        this.snackbar.open(`Denied.`);
      });
  }

  downloadAndToggleState(file: string | Document) {
    const id: number = Number(this.route.snapshot.params.id);
    this.transactionService.toggleState(id).subscribe();
    // this.offerService.toggleState(id).subscribe();
    // this.triggerDownloadFile(file);
  }

  triggerDownloadFile(doc: GeneratedDocument | Document) {
    this.transactionService.documentOpenedEvent(doc.id).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe();

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

  openPendingDocument(doc: GeneratedDocument) {
    switch (doc.documentType) {
      case 'addendum':
        this.openAddendumDialog(doc);
        break;
      case 'spq':
        this.openSPQDialog(doc);
        break;
      default:
        return;
    }
  }

  openSPQDialog(doc: GeneratedDocument): void {
    this.dialog.open(SpqDialogComponent, {
      width: '600px',
      data: {
        ...doc.documentData,
        docId: doc.id,
        allowEdit: doc.allowEdit,
        allowSign: doc.allowSign,
      }
    });
  }

  openAddendumDialog(doc: GeneratedDocument = null): void {
    this.dialog.open(AddendumDialogComponent, {
      width: '600px',
      data: {
        transactionId: this.offer && this.offer.transaction,
        offerId: this.offer && this.offer.id,
        docData: doc ? doc.documentData as AddendumData : null,
        docId: doc ? doc.id : null,
        allowEdit: doc ? doc.allowEdit : true,
        allowSign: doc ? doc.allowSign : null,
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
