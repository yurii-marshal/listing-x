import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { CounterOfferService } from '../services/counter-offer.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../auth/models';
import * as _ from 'lodash';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { forkJoin, Subject } from 'rxjs';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Offer, Person } from '../../../core-modules/models/offer';
import { SignatureDirective } from '../../../shared-modules/directives/signature.directive';
import { AgreementStatus } from '../../../core-modules/models/agreement';
import { FinishSigningDialogComponent } from '../../../shared-modules/dialogs/finish-signing-dialog/finish-signing-dialog.component';
import { CounterOfferType } from '../../../core-modules/models/counter-offer-type';
import { GeneratedDocument } from '../../../core-modules/models/document';
import { ProfileService } from '../../../core-modules/core-services/profile.service';
import { isNumber } from 'util';

export abstract class BaseCounterOfferAbstract<TModel = CounterOffer> implements OnInit, OnDestroy {
  @ViewChild('form', {static: true}) form: ElementRef;
  @ViewChildren(SignatureDirective) signatures: QueryList<SignatureDirective>;

  state: string = 'counter-offer';

  isLoading = true;

  type;
  id: number;
  offerId: number;
  offer: Offer;
  counterOffer: CounterOffer;
  documentObj;

  isDisabled: boolean = true;
  showSwitcher: boolean = false;

  isSignMode: boolean = false;

  isUserPitcher: boolean;
  isAgentSeller: boolean;
  pendingCO: GeneratedDocument[];

  documentForm: FormGroup;

  datepickerMinDate: Date;

  isSideBarOpen: boolean;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;
  isSidebarControlsVisible: boolean = false;
  user: User;
  signFields = [];
  finalSignFields = [];
  isMCOFinalSign: boolean;
  okButtonText: string;
  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public offerService: OfferService,
    public counterOfferService: CounterOfferService,
    public snackbar: MatSnackBar,
    public datePipe: DatePipe,
    public authService: AuthService,
    public dialog: MatDialog,
    public profileService: ProfileService,
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.id = +this.route.snapshot.params.id;
    this.offerId = +this.route.snapshot.params.offerId;
    this.datepickerMinDate = new Date();

    this.user = this.authService.currentUser;

    this.type = this.router.url.split('/').pop() as 'seller' | 'buyer' | 'multiple';

    forkJoin(
      this.offerService.loadOne(this.offerId),
      this.counterOfferService.loadOne(this.id),
      this.counterOfferService.getCounterOfferDocument(this.id, this.type),
    )
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(([offer, counterOffer, document]) => {
          this.offer = offer;
          this.counterOfferService.prevCO = Object.assign({}, this.counterOfferService.currentCO);
          this.counterOfferService.currentCO = counterOffer;
          this.counterOffer = counterOffer;
          this.documentObj = document;

          this.patchForm();

          this.isUserPitcher = this.counterOffer.pitchers.some(pitcher => pitcher.email === this.user.email);
          this.isAgentSeller = this.user.accountType === 'agent' && this.counterOffer.offerType as string === 'buyer_counter_offer';

          this.isDisabled = !this.isUserPitcher || this.isSignMode;

          this.showSwitcher = this.isUserPitcher && this.counterOffer.status !== AgreementStatus.Completed;

          const isFinalMode = this.counterOffer.canFinalSign && this.counterOffer.isSigned;

          // if user isn't creator there's available sign mode only / for sign / for review
          if (!this.showSwitcher || isFinalMode) {
            this.isSignMode = true;
            this.isDisabled = true;
          }

          this.allFieldsCount = Object.keys(this.documentObj).length;

          this.okButtonText = (!this.counterOffer.isSigned && this.isSignMode) || isFinalMode ? 'Finish' : 'Continue';

          this.isSidebarControlsVisible =
            this.isSideBarOpen && this.counterOffer.catchers.some((user: Person) => user.email === this.user.email);

          this.isMCOFinalSign = counterOffer.offerType as string === 'multiple_counter_offer' && counterOffer.canFinalSign;

          this.pendingCO = this.offer.pendingDocuments.filter((item) => !!CounterOfferType[item.documentType]);

          if (!this.isMCOFinalSign && !this.counterOffer.isSigned && this.counterOffer.canSign) {
            this.setSignFields(this.signFields);
          } else if (this.isMCOFinalSign) {
            this.setSignFields(this.finalSignFields);
          } else {
            this.snackbar.open('Counter Offer is already signed');
          }

          this.subscribeToFormChanges(this.documentForm);
          this.nextField(true);

          this.checkOnAgreementTransition();
          this.checkOnFinalTransitions();
          this.isLoading = false;
        },
        () => this.isLoading = false);
  }

  toggleSidebar(value: boolean) {
    this.isSideBarOpen = value;

    setTimeout(() => {
      this.isSidebarControlsVisible =
        value && this.counterOffer &&
        this.counterOffer.catchers.some((user: Person) => user.email === this.user.email);
    }, value ? 250 : 0);
  }

  closeCO() {
    this.form.nativeElement.blur();
    this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
  }

  nextField(signStatus, signatures = this.signatures.toArray().filter(el => el.isActiveSignRow)): boolean {
    if (!this.counterOffer.isSigned || this.isMCOFinalSign) {
      if (signStatus === true || isNumber(signStatus.id)) {
        if (signatures.length) {
          for (const sd of signatures) {
            if (!sd.signatureControl.value) {
              sd.scrollToButton();
              return true;
            }
          }

          // if CO has signature fields but everyone is signed
          this.openFinishingDialog();
        }

        // if CO doesn't have local signs and just is opened
        return false;
      }

      // if CO has error sign because of the offer is not signed
      if (this.offer && !this.offer.isSigned) {
        this.form.nativeElement.blur();
        this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/sign`);
      }
    }

    return false;
  }

  continue() {
    if (this.isSignMode) {
      const isSigningComplete = this.signatures.toArray().filter(el => el.isActiveSignRow).every((el) => !!el.signatureControl.value);

      if (isSigningComplete) {
        if (this.offer && !this.offer.isSigned) {
          this.form.nativeElement.blur();
          this.snackbar.open('First, please, sign the purchase agreement');
          this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/sign`);
        } else if (!this.counterOffer.isSigned || this.counterOffer.canFinalSign) {
          this.openFinishingDialog();
        } else {
          this.closeCO();
        }
      } else {
        this.nextField(true);
      }
    } else {
      this.documentForm.markAllAsTouched();

      this.scrollToFirstInvalidField()
        ? this.snackbar.open('Please, fill all mandatory fields')
        : this.modeChanged(true); // this.closeCO()
    }
  }

  getSignFieldAllowedFor(controlName: string, role: string, index: number) {
    this.signFields.push({controlName, role, index});

    return [{value: '', disabled: true}, []];
  }

  getFinalSignFieldMCO(controlName: string, role: string, index: number) {
    this.finalSignFields.push({controlName, role, index});

    return [{value: '', disabled: true}, []];
  }

  modeChanged(isSign: boolean) {
    this.isDisabled = this.isSignMode = isSign;
    this.okButtonText = this.isSignMode && (!this.counterOffer.isSigned || this.counterOffer.canFinalSign)
      ? 'Finish'
      : 'Continue';
  }

  limitLines(input, limit) {
    const values = input.value.replace(/\r\n/g, '\n').split('\n');

    if (values.length > limit) {
      input.value = values.slice(0, limit).join('\n');
    }
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  private checkOnFinalTransitions() {
    if (this.counterOfferService.prevCO && !this.signatures.toArray().find(el => el.isActiveSignRow)) {
      const completedCO = this.offer.completedDocuments.filter((item) => !!CounterOfferType[item.documentType]);
      const prevCO = completedCO.find(item => item.entityId === this.counterOfferService.prevCO.id);
      const lastCO = `/portal/offer/${this.offer.id}/counter-offers/` +
        `${this.counterOfferService.prevCO.id}/${CounterOfferType[prevCO ? prevCO.documentType : null]}`;

      if (
        this.profileService.previousRouteUrl &&
        this.profileService.previousRouteUrl.includes(lastCO) &&
        this.counterOfferService.prevCO.isSigned
      ) {
        this.openFinishingDialog();
      }
    }
  }

  private checkOnAgreementTransition() {
    if (this.profileService.previousRouteUrl) {
      const lastPA = `/portal/purchase-agreements/${this.offerId}/sign`;

      if (this.profileService.previousRouteUrl.includes(lastPA) && this.offer.isSigned) {
        this.isSignMode = true;
      }
    }
  }

  private scrollToFirstInvalidField(): boolean {
    for (const groupName of Object.keys(this.documentForm.controls)) {
      if (this.documentForm.controls[groupName].invalid) {
        for (const controlName of Object.keys((this.documentForm.controls[groupName] as FormGroup).controls)) {
          if (this.documentForm.get(`${groupName}.${controlName}`).invalid) {
            const invalidControl = document.querySelector('[formcontrolname="' + controlName + '"]');
            invalidControl.scrollIntoView({behavior: 'smooth', block: 'center'});
            return true;
          }
        }
      }
    }

    return false;
  }

  private patchForm() {
    this.completedFieldsCount = 0;

    Object.entries(this.documentObj).map(([key, value]) => {
      Object.keys(this.documentForm.controls).map((controlName) => {
        if (_.camelCase(controlName) === key && value) {
          this.completedFieldsCount += 1;

          if (this.offerService.isDateISOFormat(value)) {
            value = this.offerService.convertStringToDate(value);
          }

          this.documentForm.get(`${_.snakeCase(controlName)}`)
            .patchValue(value, {emitEvent: false, onlySelf: true});
        }
      });
    });
  }

  private subscribeToFormChanges(documentForm) {
    Object.values(documentForm.controls).map((control: FormControl, controlIndex: number) => {
      control.valueChanges
        .pipe(
          debounceTime(200),
          takeUntil(this.onDestroyed$),
        )
        .subscribe((controlValue) => {
          if (this.counterOffer.anyUserSigned && !this.counterOffer.canFinalSign && this.isUserPitcher) {
            this.resetAgreement();
          }

          this.saveDocumentField(Object.keys(documentForm.getRawValue())[controlIndex], controlValue);
        });
    });

    if (!this.offer.isSigned) {
      this.documentForm.setErrors({notSignedPA: true});
    }
  }

  private saveDocumentField(controlName: string, controlValue: any) {
    if (controlValue === '') {
      controlValue = null;
    } else if (this.offerService.isDateFormat(controlValue) || controlValue instanceof Date) {
      controlValue = this.datePipe.transform(controlValue, 'yyyy-MM-dd');
    } else if (+controlValue) {
      controlValue = String(controlValue).replace(',', '');
    }
    // show saving animation if it takes a time
    this.counterOfferService.updateCounterOfferDocumentField(this.id, this.type, {[controlName]: controlValue})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((document) => {
        this.documentObj = document;
        this.setFieldsCount();
      });
  }

  private resetAgreement() {
    this.signatures.toArray().forEach((signature) => {
      if (signature.isActiveSignRow) {
        signature.resetData();
      }
    });

    this.counterOffer.anyUserSigned = false;
    this.counterOffer.status = AgreementStatus.Started;
    this.counterOffer.isSigned = false;
    this.isSignMode = false;

    this.snackbar.open('The document was changed. Please, resign.');
  }

  private setSignFields(signFields) {
    let index = 0;

    signFields.forEach((field) => {
      if (this.counterOffer[field.role][field.index] && this.counterOffer[field.role][field.index].email === this.user.email) {
        if (!this.documentForm.get(field.controlName).value) {
          this.documentForm.get(field.controlName).enable({onlySelf: true, emitEvent: false});
        }
      }
    });

    // TODO incapsulate sign button rendering
    this.signatures.toArray()
      .filter(el => el.signatureControl.enabled)
      .map(el => {
        el.isActiveSignRow = true;
        el.renderSignButton();
        el.signId = index;
        index++;
      });
  }

  private signCO() {
    if (!this.signatures.toArray().filter(el => el.isActiveSignRow).every((el) => !!el.signatureControl.value)) {
      this.snackbar.open('Please, sign all mandatory fields');
    } else {
      this.isLoading = true;
      this.counterOfferService.signCounterOffer(this.id, this.isMCOFinalSign ? 'final_approval' : 'sign')
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe(() => {
          this.counterOffer.isSigned = true;
          this.snackbar.open('Counter Offer is signed now');

          if (this.counterOfferService.prevCO) {
            const prevPendingCO = this.pendingCO.find(item => item.entityId === this.counterOfferService.prevCO.id);
            const lastCO = `/portal/offer/${this.offer.id}/counter-offers/` +
              `${this.counterOfferService.prevCO.id}/${CounterOfferType[prevPendingCO ? prevPendingCO.documentType : null]}`;

            if (
              this.profileService.previousRouteUrl &&
              this.profileService.previousRouteUrl.includes(lastCO) &&
              !this.counterOfferService.prevCO.isSigned
            ) {
              this.counterOfferService.currentCO.isSigned = true;
              this.router.navigateByUrl(lastCO);
              return;
            }
          }

          this.closeCO();
          this.isLoading = false;
        });
    }
  }

  private setFieldsCount() {
    this.completedFieldsCount = 0;

    Object.keys(this.documentObj).map((field) => {
      if (this.documentObj[field]) {
        this.completedFieldsCount += 1;
      }
    });
  }

  private openFinishingDialog() {
    const dialogRef = this.dialog.open(FinishSigningDialogComponent, {width: '600px'});

    dialogRef.afterClosed()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((isFinished: boolean) => {
        if (isFinished) {
          this.form.nativeElement.blur();
          if (!this.offer.isSigned) {
            this.snackbar.open('Please, sign the purchase agreement first.');
            this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/sign`);
          } else if (this.pendingCO.length > 1 && this.pendingCO[0].allowSign && this.counterOffer.id !== this.pendingCO[0].entityId) {
            this.snackbar.open('Please, sign previous counter-offer');
            this.router.navigateByUrl(`portal/offer/${this.offer.id}/counter-offers/` +
              `${this.pendingCO[0].entityId}/${CounterOfferType[this.pendingCO[0].documentType]}`);
          } else {
            this.signCO();
          }
        }
      });
  }

}
