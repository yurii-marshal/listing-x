import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../../../core-modules/models/offer';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditOfferDialogComponent } from '../../../../shared-modules/dialogs/edit-offer-dialog/edit-offer-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, skip, switchMap, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SaveOfferDialogComponent } from '../../../../shared-modules/dialogs/save-offer-dialog/save-offer-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
  providers: [DatePipe]
})
export class StepTwoComponent implements OnInit, OnDestroy {
  documentForm: FormGroup;
  currentPage: number = 0;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;
  isSideBarOpen: boolean;
  offerId: number;
  offer: Offer;

  private onDestroyed$: Subject<void> = new Subject<void>();

  private pageBreakersOffsetTop: number[];
  private documentFormEl: EventTarget;

  constructor(
    private offerService: OfferService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private elRef: ElementRef,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.id;
    this.offer = this.route.snapshot.data.offer;

    this.documentForm = this.fb.group({
      page_1: this.fb.group({
        check_civil_code: [null, []],
        check_disclosure_buyer_1: [null, []],
        check_disclosure_seller_1: [null, []],
        check_disclosure_landlord_1: [null, []],
        check_disclosure_tenant_1: [null, []],
        text_disclosure_role_name_1: ['', []],
        date_disclosure_1: ['', []],
        check_disclosure_buyer_2: [null, []],
        check_disclosure_seller_2: [null, []],
        check_disclosure_landlord_2: [null, []],
        check_disclosure_tenant_2: [null, []],
        text_disclosure_role_name_2: ['', []],
        date_disclosure_2: ['', []],
        text_disclosure_agent: ['', []],
        text_disclosure_agent_lic: ['', []],
        text_disclosure_seller: ['', []],
        text_disclosure_seller_lic: ['', []],
        date_disclosure_3: ['', []],
      }),
      page_2: this.fb.group({
        text_confirm_seller_firm_name: ['', []],
        text_confirm_seller_firm_lic: ['', []],
        check_confirm_seller_is_seller: [null, []],
        check_confirm_seller_is_dual_agent: [null, []],
        text_confirm_seller_agent_firm_name: ['', []],
        text_confirm_seller_agent_firm_lic: ['', []],
        check_confirm_seller_agent_is_seller: [null, []],
        check_confirm_seller_agent_is_dual_agent: [null, []],
        text_confirm_buyer_firm_name: ['', []],
        text_confirm_buyer_firm_lic: ['', []],
        check_confirm_buyer_is_buyer: [null, []],
        check_confirm_buyer_is_dual_agent: [null, []],
        text_confirm_buyer_agent_firm_name: ['', []],
        text_confirm_buyer_agent_firm_lic: ['', []],
        check_confirm_buyer_agent_is_seller: [null, []],
        check_confirm_buyer_agent_is_dual_agent: [null, []],
      }),
      page_3: this.fb.group({
        text_acknowledge_seller_1: [null, []],
        date_acknowledge_seller_1: [null, []],
        text_acknowledge_seller_2: [null, []],
        date_acknowledge_seller_2: [null, []],
        text_acknowledge_buyer_1: [null, []],
        date_acknowledge_buyer_1: [null, []],
        text_acknowledge_buyer_2: [null, []],
        date_acknowledge_buyer_2: [null, []],
        text_acknowledge_buyer_agent_firm: [null, []],
        text_acknowledge_buyer_agent_firm_lic: [null, []],
        date_acknowledge_buyer_agent_firm_date: [null, []],
        text_acknowledge_buyer_agent: [null, []],
        text_acknowledge_buyer_agent_lic: [null, []],
        date_acknowledge_buyer_agent_date: [null, []],
        text_acknowledge_seller_agent_firm: [null, []],
        text_acknowledge_seller_agent_firm_lic: [null, []],
        date_acknowledge_seller_agent_firm_date: [null, []],
        text_acknowledge_seller_agent: [null, []],
        text_acknowledge_seller_agent_lic: [null, []],
        date_acknowledge_seller_agent_date: [null, []],
      }),
      page_4: this.fb.group({
        text_property_address: [null, []],
        text_buyer_tenant_1: [null, []],
        date_buyer_tenant_1: [null, []],
        text_buyer_tenant_2: [null, []],
        date_buyer_tenant_2: [null, []],
        text_seller_landlord_1: [null, []],
        date_seller_landlord_1: [null, []],
        text_seller_landlord_2: [null, []],
        date_seller_landlord_2: [null, []],
      }),
      page_5: this.fb.group({}),
      page_6: this.fb.group({}),
      page_7: this.fb.group({}),
      page_8: this.fb.group({}),
      page_9: this.fb.group({}),
      page_10: this.fb.group({}),
      page_11: this.fb.group({}),
      page_12: this.fb.group({}),
      page_13: this.fb.group({}),
      page_14: this.fb.group({}),
      page_15: this.fb.group({}),
      page_16: this.fb.group({}),
    }, {updateOn: 'blur'});

    this.offerService.getOfferDocument(this.offerId)
      .pipe(
        takeUntil(this.onDestroyed$)
      )
      .subscribe((doc) => {
        this.documentForm.patchValue(doc);
      });

    this.initPageBreakers();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  detectPageChange(currentScrollPosition: number) {
    for (let i = 0; i < this.pageBreakersOffsetTop.length; i++) {
      if (this.pageBreakersOffsetTop[i + 1]) {
        if (currentScrollPosition >= this.pageBreakersOffsetTop[i] && currentScrollPosition < this.pageBreakersOffsetTop[i + 1]) {
          this.currentPage = i;
          break;
        }
      }

      this.currentPage = i;
    }
  }

  subscribeToFormChanges() {
    this.documentForm.valueChanges
      .pipe(
        takeUntil(this.onDestroyed$),
        skip(1),
        switchMap(() => of(this.getDirtyFields(this.documentForm)))
      )
      .subscribe((formValues) => {
        this.documentInputChanged(formValues);
      });
  }

  documentInputChanged(formValues) {
    this.offerService.updateOfferDocumentField({offerId: this.offerId, page: this.currentPage + 1}, formValues)
      .pipe(
        takeUntil(this.onDestroyed$)
      )
      .subscribe((res) => {
        // TODO: show saving animation if it takes a time
      });
  }

  initPageBreakers() {
    this.pageBreakersOffsetTop = Array.from(this.elRef.nativeElement.querySelectorAll('.page-breaker'))
      .map((item: any) => item.offsetTop);

    this.documentFormEl = this.elRef.nativeElement.getElementsByClassName('doc-container')[0];

    fromEvent(this.documentFormEl, 'scroll')
      .pipe(
        debounceTime(300),
        takeUntil(this.onDestroyed$)
      )
      .subscribe((event: any) => {
        this.detectPageChange(event.target.scrollTop);
      });
  }

  editOffer(offerChangedModel?: Offer) {
    const dialogRef = this.dialog.open(EditOfferDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {offer: offerChangedModel || this.offer}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: any) => {
        if (data.saved) {
          this.snackbar.open('Offer is updated');
        }
        if (data.requestToSave) {
          this.openSaveOfferDialog(data.changedOfferModel);
        }
      });
  }

  openSaveOfferDialog(changedOfferModel: Offer) {
    const dialogRef = this.dialog.open(SaveOfferDialogComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: any) => {
        if (data) {
          if (data.saveAndClose) {
            this.saveOffer(changedOfferModel)
              .pipe(takeUntil(this.onDestroyed$))
              .subscribe((model: Offer) => {
                this.offer = model;
              });
          } else if (data.discard) {
            this.offer = this.offerService.currentOffer;
          } else if (data.reopen) {
            this.editOffer(changedOfferModel);
          }
        }
      });
  }

  saveOffer(model: Offer): Observable<Offer> {
    return this.offerService.update(model);
  }

  acceptOfferDocument() {
    this.router.navigate([`portal/purchase-agreement/${this.offer.id}/step-three`]);
  }

  private getDirtyFields(group: FormGroup) {
    let changedProperties = {};

    Object.keys(group.controls).forEach((name) => {
      const currentControl = group.controls[name];

      if (currentControl.dirty) {
        changedProperties = currentControl instanceof FormGroup
          ? this.getDirtyFields(currentControl)
          : {
            ...changedProperties,
            ...{
              [name]: (currentControl.value instanceof Date
                ? this.transformDate(currentControl.value)
                : currentControl.value)
            }
          };
      }
    });

    return changedProperties;
  }

  private transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}
