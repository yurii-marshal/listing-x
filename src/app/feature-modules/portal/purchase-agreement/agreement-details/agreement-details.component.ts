import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { AddendumData, Document, GeneratedDocument } from '../../../../core-modules/models/document';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map, takeUntil } from 'rxjs/operators';
import { DocumentStatus } from '../../../../core-modules/enums/document-status';
import { Offer, Person } from '../../../../core-modules/models/offer';
import { SpqDialogComponent } from '../../dialogs/spq-dialog/spq-dialog.component';
import { AddendumDialogComponent } from '../../dialogs/addendum-dialog/addendum-dialog.component';
import { CalendarEvent } from '../../../../core-modules/models/calendar-event';
import { OfferService } from '../../services/offer.service';
import { AgreementStatus } from '../../../../core-modules/models/agreement';
import { TransactionService } from '../../services/transaction.service';
import { CounterOffer } from 'src/app/core-modules/models/counter-offer';
import { CounterOfferService } from 'src/app/feature-modules/portal/services/counter-offer.service';

@Component({
  selector: 'app-agreement-details',
  templateUrl: './agreement-details.component.html',
  styleUrls: ['./agreement-details.component.scss']
})
export class AgreementDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  offer: Offer;
  counterOffers: CounterOffer[];
  calendarDataSource: CalendarEvent[];
  isOpenInviteUserOverlay: boolean;
  isResidentialAgreementCompleted: boolean = false;
  userEmailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  isAgent: boolean = this.authService.currentUser.accountType === 'agent';
  isSeller: boolean = false;
  pendingDocuments: Observable<GeneratedDocument[]>;
  completedDocuments: Observable<GeneratedDocument[]>;
  transactionsFlow: boolean;
  /* TODO: Refactor */
  readonly statusLabels: { [key: string]: string } = {
    [AgreementStatus.All]: 'All agreements',
    [AgreementStatus.Started]: 'Started',
    [AgreementStatus.Delivered]: 'Delivered',
    [AgreementStatus.Accepted]: 'Accepted',
    [AgreementStatus.Completed]: 'Completed',
    [AgreementStatus.Denied]: 'Denied',
  };
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private offerService: OfferService,
              private transactionService: TransactionService,
              private counterOfferService: CounterOfferService,
              private snackbar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit() {
    this.transactionsFlow = this.router.url.includes('transaction');
    const offerId: number = Number(this.route.snapshot.params.id);

    this.offerService.loadOne(offerId)
      .subscribe((offer: Offer) => this.offerLoaded(offer));

    this.counterOfferService.getCounterOffersList(offerId).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe((counterOffers: CounterOffer[]) => this.counterOffers = counterOffers);

    // this.offerService.loadCalendarByOffer(offerId)
    //   .subscribe(items => this.calendarDataSource = items);
  }

  ngAfterViewInit(): void {
    this.offerService.offerChanged$.pipe(
      takeUntil(this.onDestroyed$),
      flatMap(() => {
        const offerId: number = Number(this.route.snapshot.params.id);
        return this.offerService.loadOne(offerId);
      })
    ).subscribe((offer) => this.offerLoaded(offer));
  }

  offerLoaded(offer: Offer): void {
    this.offer = offer;

    const {agentBuyers, agentSellers, sellers} = offer;
    this.isSeller = [...agentSellers, ...sellers].some(({email}) => email === this.authService.currentUser.email);

    // const residentialAgreement = Array(offer.documents).find(doc => doc.documentType === GeneratedDocumentType.Contract);
    // this.isResidentialAgreementCompleted = residentialAgreement && residentialAgreement.status === DocumentStatus.Completed;

    this.filterDocumentList(offer.documents);
  }

  onDelete() {
    this.offerService.delete(this.offer.id)
      .subscribe(() => this.router.navigate(['/portal/purchase-agreements/all']));
  }

  getClassName(status: AgreementStatus): string {
    switch (status) {
      case AgreementStatus.Started:
        return 'blue';
      case AgreementStatus.Delivered:
        return 'orange';
      case AgreementStatus.Accepted:
        return 'yellow';
      case AgreementStatus.Completed:
        return 'violet';
      case AgreementStatus.Denied:
        return 'red';
    }
  }

  inviteUser() {
    this.isOpenInviteUserOverlay = false;
    const email: string = this.userEmailControl.value.toLowerCase();
    const offerId: number = Number(this.route.snapshot.params.id);
    this.transactionService.inviteUser(offerId, email)
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
    //
    // this.router.navigate([url, doc.id]);
    // this.transactionService.lockOffer(this.offer.id)
    //   .subscribe(() => this.router.navigate(['/e-sign', this.offer.id]));
    this.router.navigateByUrl(`portal/purchase-agreements/${this.offer.id}/sign`);
  }

  goToCounterOffer(id?: number) {
    if (id) {
      this.isSeller ?
        this.router.navigateByUrl(`portal/counter-offer/single/${id}/seller`) :
        this.router.navigateByUrl(`portal/counter-offer/single/${id}/buyer`);
    } else {
      this.router.navigateByUrl(`portal/counter-offer/single`);
    }
  }

  goToMCO(id?: number) {
    if (id) {
      this.router.navigateByUrl(`portal/counter-offer/multiple/${id}`);
    } else {
      this.router.navigateByUrl(`portal/counter-offer/multiple`);
    }
  }

  deny() {
    this.offerService.rejectOffer(this.offer.id)
      .subscribe(() => {
        this.offer.allowSign = false;
        this.snackbar.open(`Denied.`);
      });
  }

  downloadAndToggleState(file: string | Document) {
    const id: number = Number(this.route.snapshot.params.id);
    // this.offerService.toggleState(id).subscribe();
    // this.triggerDownloadFile(file);
  }

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
        offerId: this.offer.id,
        docData: doc ? doc.documentData as AddendumData : null,
        docId: doc ? doc.id : null
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  private filterDocumentList(documents): void {
    /**
     * contract status = STARTED
     * if all buyers signed, contract status = DELIVERED
     * when contract status is DELIVERED , sellers are allowed to sign.
     * (in case are more than one seller and if not all sellers signed , contract status = ACCEPTED.
     * after all sellers signed, contract status = COMPLETED
     */

    const completedDocsStatuses = [DocumentStatus.Completed];

    // this.pendingDocuments = of(documents).pipe(
    //   map((docs) => docs.filter(doc => !completedDocsStatuses.includes(doc.status)))
    // );
    // this.completedDocuments = of(documents).pipe(
    //   map((docs) => docs.filter(doc => completedDocsStatuses.includes(doc.status)))
    // );
  }
}
