import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { CounterOfferService } from '../services/counter-offer.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../auth/models';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { forkJoin, Subject } from 'rxjs';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Person } from '../../../core-modules/models/offer';
import { SignatureDirective } from '../../../shared-modules/directives/signature.directive';
import { AgreementStatus } from '../../../core-modules/models/agreement';

export abstract class BaseCounterOfferAbstract<TModel = CounterOffer> implements OnInit, OnDestroy {
  @ViewChild('form', {static: true}) form: ElementRef;
  @ViewChildren(SignatureDirective) signatures: QueryList<SignatureDirective>;

  state: string = 'counter-offer';

  type;
  id: number;
  offerId: number;
  counterOffer: CounterOffer;
  documentObj;

  isDisabled: boolean = true;
  showSwitcher: boolean = false;

  isSignMode: boolean = false;

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

  signFieldElements: any[] = [];
  onDestroyed$: Subject<void> = new Subject<void>();

  offerTypeTextControls = [
    'text_counter_offer_number',
    'text_offer_type_other',
  ];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public offerService: OfferService,
    public counterOfferService: CounterOfferService,
    public snackbar: MatSnackBar,
    public datePipe: DatePipe,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.params.id;
    this.offerId = +this.route.snapshot.params.offerId;
    this.datepickerMinDate = new Date();

    this.user = this.authService.currentUser;

    this.type = this.router.url.split('/').pop() as 'seller' | 'buyer' | 'multiple';

    forkJoin(
      this.counterOfferService.loadOne(this.id),
      this.counterOfferService.getCounterOfferDocument(this.id, this.type),
    )
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(([counterOffer, document]) => {
        this.counterOffer = counterOffer;
        this.documentObj = document;

        const isUserPitcher = this.counterOffer.pitchers.some(pitcher => pitcher.email === this.user.email);

        this.isDisabled = !isUserPitcher;

        this.showSwitcher = isUserPitcher && this.counterOffer.status !== AgreementStatus.Completed;

        // if user isn't pitcher there's available sign mode only / for sign / for review
        if (!this.showSwitcher) {
          this.isSignMode = true;
        }

        this.allFieldsCount = Object.keys(this.documentObj).length;
        this.okButtonText = (!this.counterOffer.isSigned && this.isSignMode) ? 'Sign' : 'Back to the offer';

        if (counterOffer.isSigned) {
          this.snackbar.open('Counter Offer is already signed');
        }

        this.isSidebarControlsVisible =
          this.isSideBarOpen && this.counterOffer.catchers.some((user: Person) => user.email === this.authService.currentUser.email);

        this.isMCOFinalSign = counterOffer.offerType as string === 'multiple_counter_offer' && counterOffer.status === 'completed';

        this.isMCOFinalSign
          ? this.setSignFields(this.finalSignFields)
          : this.setSignFields(this.signFields);

        this.patchForm();
        this.disableSignFields();

        this.subscribeToFormChanges(this.documentForm);
        this.nextField(true);
      });
  }

  closeCO() {
    this.form.nativeElement.blur();
    this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
  }

  nextField(isSigned) {
    if (isSigned && this.signFieldElements.length) {
      for (const item of this.signFieldElements) {
        if (!item.value) {
          item.scrollIntoView({behavior: 'smooth', block: 'center'});
          return;
        }
      }
    }
  }

  continue() {
    if (this.isSignMode) {
      this.signatures.toArray().filter(el => el.isActiveSignRow).every((el) => !!el.signatureControl.value)
        ? (this.counterOffer.isSigned ? this.closeCO() : this.signCO())
        : this.nextField(true);

    } else {
      this.documentForm.markAllAsTouched();

      this.scrollToFirstInvalidField()
        ? this.snackbar.open('Please, fill all mandatory fields')
        : this.closeCO();
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

  coTypeChanged(val: string) {
    this.offerTypeTextControls.forEach((controlName: string) => {
      this.documentForm.get(controlName).patchValue('');
    });
  }

  modeChanged(isSign: boolean) {
    this.isDisabled = this.isSignMode = isSign;
    this.okButtonText = (!this.counterOffer.isSigned && this.isSignMode) ? 'Sign' : 'Back to the offer';
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
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
          this.documentForm.get(`${_.snakeCase(controlName)}`)
            .patchValue(value, {emitEvent: false, onlySelf: true});
          this.completedFieldsCount += 1;
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
          this.saveDocumentField(Object.keys(documentForm.getRawValue())[controlIndex], controlValue);
        });
    });
  }

  private saveDocumentField(controlName: string, controlValue: any) {
    if (controlValue === '') {
      controlValue = null;
    } else if (controlValue instanceof Date) {
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

        if (this.counterOffer.isSigned) {
          this.resetAgreement();
        }
      });
  }

  private resetAgreement() {
    this.signatures.toArray().forEach((signature) => {
      if (signature.isActiveSignRow) {
        signature.resetData();
      }
    });

    this.counterOffer.status = AgreementStatus.Started;
    this.counterOffer.isSigned = false;

    this.snackbar.open('The document was changed. Please, resign.');
  }

  private setSignFields(signFields) {
    signFields.map((fieldObj) => {
      if (this.counterOffer[fieldObj.role][fieldObj.index] && this.counterOffer[fieldObj.role][fieldObj.index].email === this.user.email) {
        this.documentForm.get(fieldObj.controlName).setValidators([Validators.required]);
      }
    });
  }

  private disableSignFields() {
    this.signatures.toArray()
      .filter(el => el.isActiveSignRow)
      .map(el => el.signatureControl.disable({onlySelf: true, emitEvent: false}));
  }

  private signCO() {
    this.counterOfferService.signCounterOffer(this.id, this.isMCOFinalSign ? 'final_approval' : 'sign')
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.counterOffer.isSigned = true;
        this.snackbar.open('Counter Offer is signed now');
        this.closeCO();
      });
  }

  private setFieldsCount() {
    this.completedFieldsCount = 0;

    Object.keys(this.documentObj).map((field) => {
      if (this.documentObj[field]) {
        this.completedFieldsCount += 1;
      }
    });
  }

}
