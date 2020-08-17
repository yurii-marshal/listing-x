import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { CounterOfferService } from '../services/counter-offer.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../auth/models';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';

export abstract class BaseCounterOfferAbstract<TModel> implements OnInit, OnDestroy {
  @ViewChildren('form') form;

  protected id: number;
  protected counterOffer: CounterOffer = {} as CounterOffer;

  protected documentForm: FormGroup;

  protected datepickerMinDate: Date;

  protected state = 'counter-offer';

  protected isSideBarOpen: boolean;
  protected completedFieldsCount: number = 0;
  protected allFieldsCount: number = 0;

  protected isDisabled: boolean;

  protected user: User;

  protected signFieldElements: any[] = [];

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected offerService: OfferService,
    protected counterOfferService: CounterOfferService,
    protected snackbar: MatSnackBar,
    protected datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.params.id;
    this.datepickerMinDate = new Date();

    if (this.id) {
      this.counterOfferService.loadOne(this.id)
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe((data: CounterOffer) => {
          this.counterOffer = data;
        });

      this.counterOfferService.getCounterOfferDocument(this.id)
        .pipe(
          takeUntil(this.onDestroyed$),
        )
        .subscribe((model) => {
          this.patchForm(model);
          this.getAllFieldsCount(model);
          this.disableSignedFields();
          this.moveToNextSignField(true);
        });

      this.subscribeToFormChanges();
    }
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  protected closeCO() {
    this.router.navigateByUrl(`portal/purchase-agreements/` +
      (this.offerService.currentOffer ? `${this.offerService.currentOffer.id}/details` : 'all')
    );
  }

  protected moveToNextSignField(isSigned) {
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

  protected scrollToFirstInvalidField(): boolean {
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

  private patchForm(model) {
    Object.entries(model).forEach(([key, value]) => {
      Object.keys(this.documentForm.controls).forEach((groupName) => {

        if (_.camelCase(groupName) === key) {

          Object.entries(value).forEach(([field, data]) => {
            Object.keys(value).forEach((controlName) => {

              if (field === controlName && data) {
                this.documentForm.get(`${groupName}.${_.snakeCase(field)}`)
                  .patchValue(data, {emitEvent: false, onlySelf: true});
              }

            });
          });

        }

      });
    });
  }

  private getAllFieldsCount(model) {
    Object.keys(model).forEach((page) => {
      this.allFieldsCount += Object.keys(model[page]).length;
    });
  }

  private subscribeToFormChanges() {
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

  private documentInputChanged(controlName: string, controlValue: any) {
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
      .subscribe(() => {});
  }

  private disableSignedFields() {
    this.signFieldElements = Array.from(document.getElementsByClassName('sign-input'));
    this.signFieldElements.forEach(item => item.disabled = !!item.value);
  }

  protected continue() {
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

  protected getSignFieldAllowedFor(role: string, index: number) {
    // const value = {
    //   value: '',
    //   disabled: this.counterOffer[role][index] ? this.counterOffer[role][index].email !== this.user.email : true,
    // };

    return ['', []];
  }

}
