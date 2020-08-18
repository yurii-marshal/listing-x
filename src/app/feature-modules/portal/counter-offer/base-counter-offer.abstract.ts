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

  isDisabled: boolean;

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
  }

  closeCO() {
    this.router.navigateByUrl(`portal/purchase-agreements/` +
      (this.offerService.currentOffer ? `${this.offerService.currentOffer.id}/details` : 'all')
    );
  }

  moveToNextSignField(isSigned) {
    if (isSigned) {
      if (this.signFieldElements.length) {
        for (const item of this.signFieldElements) {
          if (!item.value) {
            item.scrollIntoView({behavior: 'smooth', block: 'center'});
            item.focus();
            return;
          }
        }
      }
    } else {
      this.scrollToFirstInvalidField();
    }
  }

  scrollToFirstInvalidField(): boolean {
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

  patchForm(model, documentForm) {
    Object.entries(model).forEach(([key, value]) => {
      Object.keys(documentForm.controls).forEach((groupName) => {

        if (_.camelCase(groupName) === key) {

          Object.entries(value).forEach(([field, data]) => {
            Object.keys(value).forEach((controlName) => {

              if (field === controlName && data) {
                documentForm.get(`${groupName}.${_.snakeCase(field)}`)
                  .patchValue(data, {emitEvent: false, onlySelf: true});
              }

            });
          });

        }

      });
    });
  }

  subscribeToFormChanges() {
    Object.values(this.documentForm.controls).forEach((control: FormControl, controlIndex: number) => {
      control.valueChanges
        .pipe(
          debounceTime(200),
          takeUntil(this.onDestroyed$),
        )
        .subscribe((controlValue) => {
          this.documentInputChanged(Object.keys(this.documentForm.getRawValue())[controlIndex], controlValue);
        });
    });
  }

  continue() {
    this.documentForm.markAllAsTouched();

    this.counterOffer.isSigned
      ? this.snackbar.open('Counter Offer is already signed')
      : this.offerService.signOffer(this.id)
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe(() => {
          this.counterOffer.isSigned = true;
          this.snackbar.open('Counter Offer is signed now');
        });
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
      .pipe(
        takeUntil(this.onDestroyed$),
      )
      .subscribe(() => {
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
