import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { AddendumData, Document, GeneratedDocument } from '../../../../core-modules/models/document';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, switchMap, takeUntil } from 'rxjs/operators';
import { Offer, Person } from '../../../../core-modules/models/offer';
import { SpqDialogComponent } from '../../dialogs/spq-dialog/spq-dialog.component';
import { AddendumDialogComponent } from '../../dialogs/addendum-dialog/addendum-dialog.component';
import { CalendarEvent } from '../../../../core-modules/models/calendar-event';
import { OfferService } from '../../services/offer.service';
import { AgreementStatus } from '../../../../core-modules/models/agreement';
import { TransactionService } from '../../services/transaction.service';
import { CounterOffer } from 'src/app/core-modules/models/counter-offer';
import { CounterOfferService } from 'src/app/feature-modules/portal/services/counter-offer.service';
import { CounterOfferType } from 'src/app/core-modules/models/counter-offer-type';
import { ConfirmationBarComponent } from 'src/app/shared-modules/components/confirmation-bar/confirmation-bar.component';

@Component({
  selector: 'app-agreement-details',
  templateUrl: './agreement-details.component.html',
  styleUrls: ['./agreement-details.component.scss']
})
export class AgreementDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  offer: Offer;
  calendarDataSource: CalendarEvent[];
  isOpenInviteUserOverlay: boolean;
  isResidentialAgreementCompleted: boolean = false;
  userEmailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  isAgent: boolean = this.authService.currentUser.accountType === 'agent';
  isSeller: boolean = false;
  transactionsFlow: boolean;

  readonly statusLabels: { [key: string]: string } = {
    [AgreementStatus.All]: 'All agreements',
    [AgreementStatus.Started]: 'Started',
    [AgreementStatus.Delivered]: 'Delivered',
    [AgreementStatus.Countered]: 'Countered',
    [AgreementStatus.Accepted]: 'Accepted',
    [AgreementStatus.Completed]: 'Completed',
    [AgreementStatus.Denied]: 'Denied',
  };
  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              public offerService: OfferService,
              private transactionService: TransactionService,
              private counterOfferService: CounterOfferService,
              private snackbar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit() {
    this.transactionsFlow = this.router.url.includes('transaction');
    const offerId: number = Number(this.route.snapshot.params.id);

    this.offerService.loadOne(offerId)
      .pipe(
        takeUntil(this.onDestroyed$)
      )
      .subscribe((offer: Offer) => this.offerLoaded(offer));

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
  }

  onDelete() {
    this.offerService.delete(this.offer.id).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(() => this.router.navigate(['/portal/purchase-agreements/all']));
  }

  inviteUser() {
    this.isOpenInviteUserOverlay = false;
    const email: string = this.userEmailControl.value.toLowerCase();
    const offerId: number = Number(this.route.snapshot.params.id);
    this.transactionService.inviteUser(offerId, email).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(() => {
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

  openPendingDocument(doc) {
    switch (doc.documentType) {
      case 'purchase_agreement':
        this.openSignOffer();
        break;
      default:
        this.openCounterOffer(doc);
    }
  }

  openSignOffer() {
    this.offer.userRole === 'agent_buyer' && this.offer.isSigned
    ? this.router.navigateByUrl(`portal/purchase-agreements/${this.offer.id}/step-two`)
    : this.router.navigateByUrl(`portal/purchase-agreements/${this.offer.id}/sign`);
  }

  openCounterOffer(doc) {
    this.router.navigateByUrl(
      `portal/offer/${this.offer.id}/counter-offers/${doc.counterOfferId}/${CounterOfferType[doc.documentType]}`
    );
  }

  createCounterOffer(type) {
    this.counterOfferService.createCounterOffer({offer: this.offer.id, offerType: type})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: CounterOffer) => {
        this.router.navigateByUrl(`portal/offer/${this.offer.id}/counter-offers/${data.id}/${CounterOfferType[type]}`);
      });
  }

  deny() {
    this.offerService.rejectOffer(this.offer.id).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(() => {
      this.offer.allowSign = false;
      this.snackbar.open(`Denied.`);
    });
  }

  onDeny(doc: GeneratedDocument) {
    const config: MatSnackBarConfig = {
      duration: 0,
      data: {
        message: 'Are you sure want to deny?',
        dismiss: 'Cancel',
        action: 'Yes'
      },
    };
    const snackBarRef = this.snackbar.openFromComponent(ConfirmationBarComponent, config);

    snackBarRef.onAction().pipe(
      takeUntil(this.onDestroyed$),
      switchMap(() => {
        if (doc.documentType === 'purchase_agreement') {
          this.deny();
        } else {
          return this.counterOfferService.rejectCounterOffer(doc.id);
        }
      }),
    ).subscribe(() => {
      if (doc.documentType !== 'purchase_agreement') {
        doc.allowSign = false;
        this.snackbar.open(`Denied.`);
      }
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

  rejectCO(id: number) {
    this.counterOfferService.rejectCounterOffer(id)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.router.navigateByUrl(`portal/purchase-agreements/${this.offer.id}/details`);
      });
  }

  removeCO() {

  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
