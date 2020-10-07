import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CounterOffer } from '../../../core-modules/models/counter-offer';
import { CounterOfferService } from '../services/counter-offer.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../auth/models';
import * as _ from 'lodash';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { forkJoin, Subject } from 'rxjs';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { Offer, Person } from '../../../core-modules/models/offer';
import { SignatureDirective } from '../../../shared-modules/directives/signature.directive';
import { AgreementStatus } from '../../../core-modules/models/agreement';
import { ConfirmationBarComponent } from '../../../shared-modules/components/confirmation-bar/confirmation-bar.component';
import { FinishSigningDialogComponent } from '../../../shared-modules/dialogs/finish-signing-dialog/finish-signing-dialog.component';

export abstract class BaseCounterOfferAbstract<TModel = CounterOffer> implements OnInit, OnDestroy {
  @ViewChild('form', {static: true}) form: ElementRef;
  @ViewChildren(SignatureDirective) signatures: QueryList<SignatureDirective>;

  state: string = 'counter-offer';

  type;
  id: number;
  offerId: number;
  offer: Offer;
  counterOffer: CounterOffer;
  documentObj;

  isDisabled: boolean = true;
  showSwitcher: boolean = false;

  isSignMode: boolean = true;

  isUserPitcher: boolean;
  isAgentSeller: boolean;

  documentForm: FormGroup;
  prevFormSnapshot: FormGroup;

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
  ) {
  }

  ngOnInit() {
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
        this.counterOffer = counterOffer;
        this.documentObj = document;

        this.patchForm();

        this.isUserPitcher = this.counterOffer.pitchers.some(pitcher => pitcher.email === this.user.email);
        this.isAgentSeller = this.user.accountType === 'agent' && this.counterOffer.offerType as string === 'buyer_counter_offer';

        this.isDisabled = !this.isUserPitcher;

        this.showSwitcher = this.isUserPitcher && this.counterOffer.status !== AgreementStatus.Completed;

        const isFinalMode = this.counterOffer.canFinalSign && this.counterOffer.isSigned;

        // if user isn't pitcher there's available sign mode only / for sign / for review
        if (!this.showSwitcher || isFinalMode) {
          this.isSignMode = true;
          this.isDisabled = true;
        }

        this.allFieldsCount = Object.keys(this.documentObj).length;

        this.okButtonText = (!this.counterOffer.isSigned && this.isSignMode) || isFinalMode ? 'Finish' : 'Back to the offer';

        this.isSidebarControlsVisible =
          this.isSideBarOpen && this.counterOffer.catchers.some((user: Person) => user.email === this.authService.currentUser.email);

        this.isMCOFinalSign = counterOffer.offerType as string === 'multiple_counter_offer' && counterOffer.canFinalSign;

        if (!this.isMCOFinalSign && !this.counterOffer.isSigned && this.counterOffer.canSign) {
          this.setSignFields(this.signFields);
        } else if (this.isMCOFinalSign) {
          this.setSignFields(this.finalSignFields);
        } else {
          this.snackbar.open('Counter Offer is already signed');
        }

        this.subscribeToFormChanges(this.documentForm);
        this.nextField(true);
      });
  }

  toggleSidebar(value: boolean) {
    this.isSideBarOpen = value;

    setTimeout(() => {
      this.isSidebarControlsVisible =
        value && this.counterOffer.catchers.some((user: Person) => user.email === this.authService.currentUser.email);
    }, value ? 250 : 0);
  }

  closeCO() {
    this.form.nativeElement.blur();
    this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/details`);
  }

  nextField(signStatus, signatures = this.signatures.toArray().filter(el => el.isActiveSignRow)): boolean {
    if (!this.counterOffer.isSigned || this.isMCOFinalSign) {
      if (signStatus === true) {
        if (signatures.length) {
          for (const sd of signatures) {
            if (sd.isActiveSignRow && !sd.signatureControl.value) {
              sd.scrollToButton();
              return true;
            }
          }
        }

        this.openFinishingDialog();
        return false;
      }

      if (signStatus.notSignedPA) {
        this.form.nativeElement.blur();
        this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/sign`);
      }
    }
  }

  continue() {
    if (this.isSignMode) {
      const isSigningComplete = this.signatures.toArray().filter(el => el.isActiveSignRow).every((el) => !!el.signatureControl.value);

      if (isSigningComplete) {
        !this.counterOffer.isSigned || this.counterOffer.canFinalSign ? this.openFinishingDialog() : this.closeCO();
      } else {
        this.nextField(true);
      }
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

  modeChanged(isSign: boolean) {
    this.isDisabled = this.isSignMode = isSign;
    this.okButtonText = this.isSignMode && (!this.counterOffer.isSigned || this.counterOffer.canFinalSign)
      ? 'Finish'
      : 'Back to the offer';
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
          this.prevFormSnapshot.get(`${_.snakeCase(controlName)}`)
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
          if (this.counterOffer.anyUserSigned && !this.counterOffer.canFinalSign) {
            const config: MatSnackBarConfig = {
              duration: 0,
              data: {
                message: 'Are you sure want to change a field? All users signatures will be cleared.',
                dismiss: 'Cancel',
                action: 'Yes'
              },
            };

            const snackBarRef = this.snackbar.openFromComponent(ConfirmationBarComponent, config);

            snackBarRef.afterDismissed()
              .pipe(takeUntil(this.onDestroyed$))
              .subscribe(info => {
                if (info.dismissedByAction) {
                  this.prevFormSnapshot.patchValue(this.documentForm.getRawValue(), {emitEvent: false});
                  this.resetAgreement();
                  this.saveDocumentField(Object.keys(documentForm.getRawValue())[controlIndex], controlValue);
                } else {
                  this.documentForm.patchValue(this.prevFormSnapshot.getRawValue(), {emitEvent: false});
                }
              });
          } else {
            this.prevFormSnapshot.patchValue(this.documentForm.getRawValue(), {emitEvent: false});
            this.saveDocumentField(Object.keys(documentForm.getRawValue())[controlIndex], controlValue);
          }
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

    this.snackbar.open('The document was changed. Please, resign.');
  }

  private setSignFields(signFields) {
    signFields.forEach((field) => {
      if (this.counterOffer[field.role][field.index] && this.counterOffer[field.role][field.index].email === this.user.email) {
        if (!this.documentForm.get(field.controlName).value) {
          this.documentForm.get(field.controlName).enable({onlySelf: true, emitEvent: false});
        }
      }
    });

    this.signatures.toArray()
      .filter(el => el.signatureControl.enabled)
      .map(el => {
        el.isActiveSignRow = true;
        el.renderSignButton();
        el.signatureControl.disable({onlySelf: true, emitEvent: false});
      });
  }

  private signCO() {
    if (!this.signatures.toArray().filter(el => el.isActiveSignRow).every((el) => !!el.signatureControl.value)) {
      this.snackbar.open('Please, sign all mandatory fields');
    } else {
      this.counterOfferService.signCounterOffer(this.id, this.isMCOFinalSign ? 'final_approval' : 'sign')
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe(() => {
          this.counterOffer.isSigned = true;
          this.snackbar.open('Counter Offer is signed now');
          this.closeCO();
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
          if (this.offer.isSigned) {
            this.signCO();
          } else {
            this.form.nativeElement.blur();
            this.snackbar.open('Please, sign the purchase agreement first.');
            this.router.navigateByUrl(`portal/purchase-agreements/${this.offerId}/sign`);
          }
        }
      });
  }

}
