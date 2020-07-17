import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../../../core-modules/models/offer';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditOfferDialogComponent } from '../../../../shared-modules/dialogs/edit-offer-dialog/edit-offer-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SaveOfferDialogComponent } from '../../../../shared-modules/dialogs/save-offer-dialog/save-offer-dialog.component';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';

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
  completedPageCount: number = 0;
  allFieldsCount: number = 0;
  allPageCount: number = 0;
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
      page_5: this.fb.group({
        date_date_prepared: [null, []],
        text_offer_buyer_customer: [null, []],
        text_offer_street_name: [null, []],
        text_offer_city: [null, []],
        text_offer_country: [null, []],
        text_offer_zip_code: [null, []],
        text_offer_apn: [null, []],
        text_offer_price_text: [null, []],
        text_offer_price_digits: [null, []],
        check_escrow_date: [null, []],
        date_escrow_date: [null, []],
        check_escrow_days: [null, []],
        text_escrow_days: [null, []],
        check_agency_disclosure: [null, []],
        text_agency_broker_seller_firm: [null, []],
        text_agency_broker_seller_firm_lic: [null, []],
        check_agency_broker_of_seller: [null, []],
        check_agency_broker_seller_both: [null, []],
        text_agency_broker_seller_agent: [null, []],
        text_agency_broker_seller_agent_lic: [null, []],
        check_agency_broker_seller_agent: [null, []],
        check_agency_broker_seller_dual: [null, []],
        text_agency_broker_buyer_firm: [null, []],
        text_agency_broker_buyer_firm_lic: [null, []],
        check_agency_broker_of_buyer: [null, []],
        check_agency_broker_buyer_both: [null, []],
        text_agency_broker_buyer_agent: [null, []],
        text_agency_broker_buyer_agent_lic: [null, []],
        check_agency_broker_buyer_agent: [null, []],
        check_agency_broker_buyer_dual: [null, []],
        check_agency_competing_buyers_and_sellers: [null, []],
        text_finance_terms_amount: [null, []],
        check_finance_buyer_cashier_check: [null, []],
        check_finance_buyer_personal_check: [null, []],
        check_finance_buyer_other_check: [null, []],
        text_finance_buyer_other_details: [null, []],
        text_finance_countdown_alternative: [null, []],
        check_finance_buyer_deposit_agent: [null, []],
        text_finance_buyer_deposit_check: [null, []],
        text_finance_submit_to_agent_alt: [null, []],
        text_finance_payable_to: [null, []],
        text_finance_deposit_countdown_alt: [null, []],
        text_finance_increase_deposit_countdown: [null, []],
        text_finance_increase_deposit_countdown_alt: [null, []],
        text_finance_increased_deposit_amount: [null, []],
        check_finance_all_cash_offer: [null, []],
        check_finance_attach_to_buyer_shall: [null, []],
        text_finance_verification_deliver_countdown: [null, []],
        check_finance_loan_type_fha: [null, []],
        check_finance_loan_type_va: [null, []],
        check_finance_loan_type_seller: [null, []],
        check_finance_loan_type_assumed: [null, []],
        check_finance_loan_type_other: [null, []],
        text_finance_loan_type_other_details: [null, []],
        text_finance_loan_max_percent: [null, []],
        check_finance_first_loan_adjustable: [null, []],
        text_finance_loan_initial_rate: [null, []],
        text_finance_loan_max_pay_points: [null, []],
        check_finance_second_loan_amount: [null, []],
        check_finance_second_loan_type_seller: [null, []],
        check_finance_second_loan_type_assumed: [null, []],
        check_finance_second_loan_type_other: [null, []],
        text_finance_second_loan_type_other_details: [null, []],
        text_finance_second_loan_max_percent: [null, []],
        check_finance_second_loan_adjustable: [null, []],
        text_finance_second_loan_initial_rate: [null, []],
        text_finance_second_loan_max_pay_points: [null, []],
        text_finance_written_notice_delivery_days: [null, []],
        text_finance_first_loan_amount: [null, []],
        text_finance_second_loan_amount: [null, []],
        text_finance_additional_terms: [null, []],
        text_finance_down_payment_balance: [null, []],
        text_finance_additional_terms_amount: [null, []],
        text_finance_buyer_initials_first: [null, []],
        text_finance_buyer_initials_second: [null, []],
        text_finance_seller_initials_first: [null, []],
        text_finance_seller_initials_second: [null, []],
      }),
      page_6: this.fb.group({
        text_property_address: [null, []],
        date_property_date: [null, []],
        text_closing_cost_countdown_alt: [null, []],
        check_closing_cost_verification_attached: [null, []],
        check_appraisal_agreement: [null, []],
        text_appraisal_contingency_canceling_days: [null, []],
        text_loan_terms_application_days: [null, []],
        check_loan_terms_letter_attached: [null, []],
        text_loan_terms_contingency_removal_days: [null, []],
        check_no_loan_contingency: [null, []],
        check_sale_of_buyers_property: [null, []],
        check_addenda_addendum: [null, []],
        check_addenda_back_up_offer: [null, []],
        check_addenda_court_confirmation: [null, []],
        check_addenda_septic: [null, []],
        check_addenda_short_sale: [null, []],
        check_addenda_other: [null, []],
        check_advisories_buyers_inspection: [null, []],
        check_advisories_probate_advisories: [null, []],
        check_advisories_statewide_buyers: [null, []],
        check_advisories_trust_advisory: [null, []],
        check_advisories_reo_advisory: [null, []],
        check_advisories_short_sale: [null, []],
        check_advisories_other: [null, []],
        text_other_terms: [null, []],
        check_allocation_report_buyer_first: [null, []],
        check_allocation_report_seller_first: [null, []],
        check_allocation_report_tax: [null, []],
        check_allocation_report_environmental: [null, []],
        check_allocation_report_other: [null, []],
        text_allocation_report_other: [null, []],
        text_allocation_report_prepared_by_first: [null, []],
        check_allocation_report_buyer_second: [null, []],
        check_allocation_report_seller_second: [null, []],
        text_allocation_report_following_first: [null, []],
        text_allocation_report_prepared_by_second: [null, []],
        check_allocation_report_buyer_third: [null, []],
        check_allocation_report_seller_third: [null, []],
        text_allocation_report_following_second: [null, []],
        text_allocation_report_prepared_by_third: [null, []],
        check_allocation_report_government_buyer: [null, []],
        check_allocation_report_government_seller: [null, []],
        text_allocation_report_buyer_initials_first: [null, []],
        text_allocation_report_buyer_initials_second: [null, []],
        text_allocation_report_seller_initials_first: [null, []],
        text_allocation_report_seller_initials_second: [null, []],
      }),
      page_7: this.fb.group({
        text_property_address: [null, []],
        date_property_date: [null, []],
        check_buyer_pay_government: [null, []],
        check_seller_pay_government: [null, []],
        check_buyer_pay_government_coe: [null, []],
        check_seller_pay_government_coe: [null, []],
        check_escrow_buyer_pay: [null, []],
        check_escrow_seller_pay: [null, []],
        text_escrow_pay_amount: [null, []],
        text_escrow_holder: [null, []],
        text_escrow_payment_days: [null, []],
        check_escrow_buyer_pay_insurance: [null, []],
        check_escrow_seller_pay_insurance: [null, []],
        text_escrow_paragraph_13: [null, []],
        text_escrow_owner_title_issued_by: [null, []],
        check_other_costs_buyer_country_tax: [null, []],
        check_other_costs_seller_country_tax: [null, []],
        text_other_costs_country_tax_amount: [null, []],
        check_other_costs_buyer_city_tax: [null, []],
        check_other_costs_seller_city_tax: [null, []],
        text_other_costs_country_city_amount: [null, []],
        check_other_costs_buyer_hometown_tax: [null, []],
        check_other_costs_seller_hometown_tax: [null, []],
        text_other_costs_country_hometown_amount: [null, []],
        check_other_costs_buyer_hao_fee: [null, []],
        check_other_costs_seller_hao_fee: [null, []],
        check_other_costs_buyer_private_fee: [null, []],
        check_other_costs_seller_private_fee: [null, []],
        text_other_costs_private_fee_amount: [null, []],
        check_other_costs_buyer_shall_pay_first: [null, []],
        check_other_costs_seller_shall_pay_first: [null, []],
        text_other_costs_shall_pay_amount_first: [null, []],
        check_other_costs_buyer_shall_pay_second: [null, []],
        check_other_costs_seller_shall_pay_second: [null, []],
        text_other_costs_shall_pay_amount_second: [null, []],
        check_other_costs_buyer_shall_pay_cost: [null, []],
        check_other_costs_seller_shall_pay_cost: [null, []],
        text_other_costs_shall_pay_amount_cost: [null, []],
        check_other_costs_warranty: [null, []],
        text_other_costs_warranty_issued_by: [null, []],
        check_other_costs_air_conditioner: [null, []],
        check_other_costs_pool: [null, []],
        check_other_costs_other: [null, []],
        text_other_costs_other_details: [null, []],
        check_other_costs_warranty_plan: [null, []],
        check_include_items_all_stoves: [null, []],
        text_include_items_all_stoves_except: [null, []],
        check_include_items_all_refrigerators: [null, []],
        text_include_items_all_refrigerators_except: [null, []],
        check_include_items_all_washers: [null, []],
        text_include_items_all_washers_except: [null, []],
        text_include_items_additional: [null, []],
        check_include_items_devices: [null, []],
        text_include_items_without_warranty: [null, []],
        text_exclude_from_sale: [null, []],
        check_exclude_from_sale: [null, []],
        check_closing_buyer_intend: [null, []],
        text_possession_deliver_time: [null, []],
        check_possession_deliver_time_am: [null, []],
        check_possession_deliver_time_pm: [null, []],
        check_possession_deliver_no_later_than: [null, []],
        text_possession_deliver_no_later_than: [null, []],
        check_possession_deliver_at: [null, []],
        text_possession_deliver_at: [null, []],
        check_possession_deliver_at_am: [null, []],
        check_possession_deliver_at_pm: [null, []],
        date_possession_deliver: [null, []],
        text_possession_deliver_buyer_initials_first: [null, []],
        text_possession_deliver_buyer_initials_second: [null, []],
        text_possession_deliver_seller_initials_first: [null, []],
        text_possession_deliver_seller_initials_second: [null, []],
      }),
      page_8: this.fb.group({
        text_property_address: [null, []],
        date_property_date: [null, []],
        check_occupancy_agreement_car_form_sip: [null, []],
        check_occupancy_agreement_car_form_rlap: [null, []],
        text_property_vacant_days: [null, []],
        text_seller_disclosure_days: [null, []],
        check_tenant_to_remain: [null, []],
        text_buyer_initials_first: [null, []],
        text_buyer_initials_second: [null, []],
        text_seller_initials_first: [null, []],
        text_seller_initials_second: [null, []],
      }),
      page_9: this.fb.group({
        text_property_address: [null, []],
        date_property_date: [null, []],
        text_seller_request_days: [null, []],
        text_buyer_initials_first: [null, []],
        text_buyer_initials_second: [null, []],
        text_seller_initials_first: [null, []],
        text_seller_initials_second: [null, []],
      }),
      // page_10: this.fb.group({}),
      // page_11: this.fb.group({}),
      // page_12: this.fb.group({}),
      // page_13: this.fb.group({}),
      // page_14: this.fb.group({}),
      // page_15: this.fb.group({}),
      // page_16: this.fb.group({}),
    }, {updateOn: 'blur'});

    this.offerService.getOfferDocument(this.offerId)
      .pipe(
        takeUntil(this.onDestroyed$),
      )
      .subscribe((model) => {
        this.patchForm(model);

        Object.keys(model).forEach((page) => {
          this.allFieldsCount += Object.keys(model[page]).length;
        });

        this.updatePageProgress(model, 0);
      });

    this.initPageBreakers();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  patchForm(model) {
    Object.entries(model).forEach(([key, value]) => {
      Object.keys(this.documentForm.controls).forEach((groupName) => {

        if (_.camelCase(groupName) === key) {

          const formControlNames: string[] = Object.keys(value);

          Object.entries(value).forEach(([field, data]) => {
            formControlNames.forEach((controlName) => {

              if (field === controlName) {
                const group = this.documentForm.controls[groupName] as FormGroup;
                group.get(_.snakeCase(field)).patchValue(data);
              }

            });
          });
        }

      });
    });
  }

  updatePageProgress(formObj, pageNum) {
    const pageObj = Object.values(formObj)[pageNum];

    this.completedFieldsCount = 0;

    Object.keys(formObj).forEach((pageKey) => {
      Object.values(formObj[pageKey]).forEach((field) => {
        if (field) {
          this.completedFieldsCount += 1;
        }
      });
    });

    this.allPageCount = Object.values(pageObj).length;
    this.completedPageCount = Object.values(pageObj).filter((val) => !!val).length;
  }

  detectPageChange(currentScrollPosition: number) {
    for (let i = 0; i < this.pageBreakersOffsetTop.length; i++) {
      if (this.pageBreakersOffsetTop[i + 1]) {
        if (currentScrollPosition >= this.pageBreakersOffsetTop[i] && currentScrollPosition < this.pageBreakersOffsetTop[i + 1]) {
          if (this.currentPage !== i) {
            this.updatePageProgress(this.documentForm.getRawValue(), i);
          }
          this.currentPage = i;
          break;
        }
      }
    }
  }

  subscribeToFormChanges() {
    Object.values(this.documentForm.controls).forEach((group: FormGroup, groupIndex: number) => {
      Object.values(group.controls).forEach((control: FormControl, controlIndex: number) => {
        control.valueChanges.pipe(takeUntil(this.onDestroyed$))
          .subscribe((controlValue) => {
            this.documentInputChanged(Object.keys(group.value)[controlIndex], controlValue, group, groupIndex + 1);
          });
      });
    });
  }

  documentInputChanged(controlName: string, controlValue: any, group: FormGroup, groupIndex: number) {
    if (controlValue instanceof Date) {
      controlValue = this.datePipe.transform(controlValue, 'yyyy-MM-dd');
    }
    // TODO: show saving animation if it takes a time
    this.offerService.updateOfferDocumentField({offerId: this.offerId, page: groupIndex + 1}, {[controlName]: controlValue})
      .pipe(
        takeUntil(this.onDestroyed$),
      )
      .subscribe(() => {
        this.updatePageProgress(this.documentForm.getRawValue(), this.currentPage);
      });
  }

  initPageBreakers() {
    this.pageBreakersOffsetTop =
      Array.from(this.elRef.nativeElement.querySelectorAll('.page-breaker'))
        .map((item: any) => item.offsetTop);

    this.documentFormEl = this.elRef.nativeElement.getElementsByClassName('doc-container')[0];

    fromEvent(this.documentFormEl, 'scroll')
      .pipe(
        debounceTime(100),
        takeUntil(this.onDestroyed$),
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
}
