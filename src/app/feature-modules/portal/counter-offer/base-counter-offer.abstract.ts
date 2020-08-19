import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { CounterOfferService } from '../services/counter-offer.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../auth/models';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';

export abstract class BaseCounterOfferAbstract<TModel = CounterOffer> implements OnInit, OnDestroy {
  @ViewChildren('form') form;

  type;
  id: number;
  counterOffer: CounterOffer = {} as CounterOffer;

  documentForm: FormGroup;

  datepickerMinDate: Date;

  state = 'counter-offer';

  isSideBarOpen: boolean;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;

  isDisabled: boolean = true;

  user: User;

  signFieldElements: any[] = [];
  onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public offerService: OfferService,
    public counterOfferService: CounterOfferService,
    public snackbar: MatSnackBar,
    public datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.params.id;
    this.datepickerMinDate = new Date();

    this.signFieldElements = Array.from(document.getElementsByClassName('sign-input'));

    if (this.id) {
      this.type = this.router.url.split('/').pop() as 'seller' | 'buyer' | 'multiple';
    }
  }

  closeCO() {
    this.router.navigateByUrl(`portal/purchase-agreements/${this.offerService.currentOffer && this.offerService.currentOffer.id || 'all'}`);
  }

  moveToNextSignField(isSigned, documentForm) {
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
      this.scrollToFirstInvalidField(documentForm);
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

  patchForm(model, documentForm) {
    Object.entries(model).forEach(([key, value]) => {
      Object.keys(documentForm.controls).forEach((controlName) => {

        if (_.camelCase(controlName) === key && value) {
          documentForm.get(`${_.snakeCase(controlName)}`)
            .patchValue(value, {emitEvent: false, onlySelf: true});
        }

      });
    });
  }

  subscribeToFormChanges(documentForm) {
    Object.values(documentForm.controls).forEach((control: FormControl, controlIndex: number) => {
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

  continue() {
    this.documentForm.markAllAsTouched();

    if (!this.counterOffer.isSigned) {
      if (this.documentForm.valid) {
        this.counterOfferService.signCounterOffer(this.id)
          .pipe(takeUntil(this.onDestroyed$))
          .subscribe(() => {
            this.counterOffer.isSigned = true;
            this.snackbar.open('Counter Offer is signed now');
            this.router.navigateByUrl(`portal/purchase-agreements/${this.offerService.currentOffer.id}`);
          });
      } else {
        this.snackbar.open('Please, fill all mandatory fields');
      }
    } else {
      this.router.navigateByUrl(`portal/purchase-agreements/${this.offerService.currentOffer.id}`);
    }
  }

  getSignFieldAllowedFor(role: string, index: number) {
    // const value = {
    //   value: '',
    //   disabled: this.counterOffer[role][index] ? this.counterOffer[role][index].email !== this.user.email : true,
    // };

    return ['', []];
  }

  getAllFieldsCount(model) {
    Object.keys(model).forEach((page) => {
      this.allFieldsCount += Object.keys(model[page]).length;
    });
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
    this.counterOfferService.updateCounterOfferDocumentField({offerId: this.id}, {[controlName]: controlValue})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
      });
  }

  disableSignedFields() {
    this.signFieldElements.forEach(item => item.disabled = !!item.value);
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

}
