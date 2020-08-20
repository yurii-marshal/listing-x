import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { CounterOfferService } from '../services/counter-offer.service';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../auth/models';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { forkJoin, Observable, Subject } from 'rxjs';
import { AuthService } from '../../../core-modules/core-services/auth.service';

export abstract class BaseCounterOfferAbstract<TModel = CounterOffer> implements OnInit, OnDestroy {
  @ViewChildren('form') form;

  type;
  id: number;
  offerId: number;
  counterOffer: CounterOffer;
  documentObj;

  documentForm: FormGroup;

  datepickerMinDate: Date;

  state = 'counter-offer';

  isSideBarOpen: boolean;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;

  isDisabled: boolean;

  user: User;

  signFields = [];

  signFieldElements: any[] = [];
  onDestroyed$: Subject<void> = new Subject<void>();

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

    this.getCounterOffer()
      .pipe(
        takeUntil(this.onDestroyed$),
        map(() => this.patchForm())
      ).subscribe(() => this.nextField(true));
  }

  getCounterOffer(): Observable<any> {
    return forkJoin(
      this.counterOfferService.loadOne(this.id),
      this.counterOfferService.getCounterOfferDocument(this.id, this.type),
    )
      .pipe(
        takeUntil(this.onDestroyed$),
        map(([counterOffer, document]) => {
          this.counterOffer = counterOffer;
          this.documentObj = document;
          this.isDisabled = this.counterOffer.pitcher !== this.user.id;

          if (counterOffer.isSigned) {
            this.snackbar.open('Counter Offer is already signed');
          }

          this.setSignFields();
          this.subscribeToFormChanges(this.documentForm);
        }),
      );
  }

  closeCO() {
    this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
  }

  nextField(isSigned) {
    if (isSigned) {
      if (this.signFieldElements.length) {
        for (const item of this.signFieldElements) {
          if (!item.value) {
            item.scrollIntoView({behavior: 'smooth', block: 'center'});
            item.focus();
            return;
          }
        }

        // setTimeout(() => this.counterOfferService.signCounterOffer(), 500);
      }
    } else {
      this.scrollToFirstInvalidField(this.documentForm);
    }
  }

  scrollToFirstInvalidField(documentForm): boolean {
    for (const groupName of Object.keys(documentForm.controls)) {
      if (documentForm.controls[groupName].invalid) {
        for (const controlName of Object.keys((documentForm.controls[groupName] as FormGroup).controls)) {
          if (documentForm.get(`${groupName}.${controlName}`).invalid) {
            const invalidControl = document.querySelector('[formcontrolname="' + controlName + '"]');
            invalidControl.scrollIntoView({behavior: 'smooth', block: 'center'});
            return true;
          }
        }
      }
    }

    return false;
  }

  patchForm() {
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

    this.getAllFieldsCount();
    this.disableSignedFields();
  }

  subscribeToFormChanges(documentForm) {
    Object.values(documentForm.controls).map((control: FormControl, controlIndex: number) => {
      control.valueChanges
        .pipe(
          debounceTime(200),
          takeUntil(this.onDestroyed$),
        )
        .subscribe((controlValue) => {
          this.documentInputChanged(Object.keys(documentForm.getRawValue())[controlIndex], controlValue);
        });
    });
  }

  rejectCO() {
    this.counterOfferService.rejectCounterOffer(this.offerId)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}`);
      });
  }

  createCO(type: 'counter_offer' | 'multiple_counter_offer' | 'buyer_counter_offer') {
    this.counterOfferService.createCounterOffer({offer: this.offerId, type})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: CounterOffer) => {
        this.router.navigateByUrl(`portal/offer/${this.offerId}/counter-offers/${data.id}/multiple`);
      });
  }

  continue() {
    this.documentForm.markAllAsTouched();

    if (!this.counterOffer.isSigned) {
      if (this.documentForm.valid) {
        this.counterOfferService.signCounterOffer(this.id)
          .pipe(takeUntil(this.onDestroyed$))
          .subscribe(() => {
            this.counterOffer.isSigned = true;
            this.snackbar.open('Counter Offer is signed now');
            this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
          });
      } else {
        this.snackbar.open('Please, fill all mandatory fields');
      }
    } else {
      this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
    }
  }

  getSignFieldAllowedFor(controlName: string, role: string, index: number) {
    this.signFields.push({controlName, role, index});

    return ['', []];
  }

  setSignFields() {
    this.signFields.map((fieldObj) => {
      if (
        this.documentForm.get(fieldObj.controlName).value ||
        (this.counterOffer[fieldObj.role][fieldObj.index] &&
        this.counterOffer[fieldObj.role][fieldObj.index].email !== this.user.email)
      ) {
        this.documentForm.get(fieldObj.controlName).disable({emitEvent: false});
      }
    });
  }

  getAllFieldsCount() {
    this.allFieldsCount = Object.keys(this.documentObj).length;
  }

  documentInputChanged(controlName: string, controlValue: any) {
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
        this.completedFieldsCount = 0;

        Object.keys(document).map((field) => {
          if (document[field]) {
            this.completedFieldsCount += 1;
          }
        });
      });
  }

  disableSignedFields() {
    this.signFieldElements = Array.from(document.getElementsByClassName('sign-input'));
    this.signFieldElements.forEach(item => item.disabled = !!item.value);
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

}
