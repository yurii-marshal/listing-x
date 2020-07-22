import { Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../../../core-modules/models/offer';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditOfferDialogComponent } from '../../../../shared-modules/dialogs/edit-offer-dialog/edit-offer-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  @ViewChildren('form') form;

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

  private downPaymentAmountPredicates: string[] = [
    'text_offer_price_digits',
    'text_finance_terms_amount',
    'text_finance_first_loan_amount',
    'text_finance_second_loan_amount',
  ];

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

    const buyer = this.offer.buyers[0];
    const buyerSecond = this.offer.buyers[1];
    const seller = this.offer.sellers[0];
    const sellerSecond = this.offer.sellers[1];
    const BA = this.offer.agentBuyers[0];
    const SA = this.offer.agentSellers[0];
    const fullAddress = `${this.offer.streetName}, ${this.offer.city}, ${this.offer.state}, ${this.offer.zip}, ${this.offer.apn}`;

    this.documentForm = this.fb.group({
      page_1: this.fb.group({
        check_civil_code: [null, []],
        check_disclosure_buyer_1: [{value: true, disabled: true}, []],
        check_disclosure_seller_1: [{value: null, disabled: true}, []],
        check_disclosure_landlord_1: [{value: null, disabled: true}, []],
        check_disclosure_tenant_1: [{value: null, disabled: true}, []],
        text_disclosure_role_name_1: ['', []],
        date_disclosure_1: ['', []],
        check_disclosure_buyer_2: [{value: true, disabled: true}, []],
        check_disclosure_seller_2: [{value: null, disabled: true}, []],
        check_disclosure_landlord_2: [{value: null, disabled: true}, []],
        check_disclosure_tenant_2: [{value: null, disabled: true}, []],
        text_disclosure_role_name_2: ['', []],
        date_disclosure_2: ['', []],
        text_disclosure_agent: [{value: BA.companyName, disabled: true}, []],
        text_disclosure_agent_lic: [{value: BA.licenseCode, disabled: true}, []],
        text_disclosure_seller: ['', []],
        text_disclosure_seller_lic: [{value: seller.licenseCode, disabled: true}, []],
        date_disclosure_3: ['', []],
      }),
      page_2: this.fb.group({
        text_confirm_seller_firm_name: [{value: '', disabled: true}, []],
        text_confirm_seller_firm_lic: [{value: '', disabled: true}, []],
        check_confirm_seller_is_seller: [{value: true, disabled: true}, []],
        check_confirm_seller_is_dual_agent: [{value: null, disabled: true}, []],
        text_confirm_seller_agent_firm_name: [{value: '', disabled: true}, []],
        text_confirm_seller_agent_firm_lic: [{value: '', disabled: true}, []],
        check_confirm_seller_agent_is_seller: [{value: true, disabled: true}, []],
        check_confirm_seller_agent_is_dual_agent: [{value: null, disabled: true}, []],
        text_confirm_buyer_firm_name: [{value: '', disabled: true}, []],
        text_confirm_buyer_firm_lic: [{value: '', disabled: true}, []],
        check_confirm_buyer_is_buyer: [{value: true, disabled: true}, []],
        check_confirm_buyer_is_dual_agent: [{value: null, disabled: true}, []],
        text_confirm_buyer_agent_firm_name: [{value: '', disabled: true}, []],
        text_confirm_buyer_agent_firm_lic: [{value: '', disabled: true}, []],
        check_confirm_buyer_agent_is_seller: [{value: true, disabled: true}, []],
        check_confirm_buyer_agent_is_dual_agent: [{value: null, disabled: true}, []],
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
        text_acknowledge_buyer_agent_firm: [{value: BA.companyName, disabled: true}, []],
        text_acknowledge_buyer_agent_firm_lic: [{value: BA.licenseCode, disabled: true}, []],
        date_acknowledge_buyer_agent_firm_date: [null, []],
        text_acknowledge_buyer_agent: [null, []],
        text_acknowledge_buyer_agent_lic: [{value: BA.licenseCode, disabled: true}, []],
        date_acknowledge_buyer_agent_date: [null, []],
        text_acknowledge_seller_agent_firm: [{value: SA.companyName, disabled: true}, []],
        text_acknowledge_seller_agent_firm_lic: [{value: SA.licenseCode, disabled: true}, []],
        date_acknowledge_seller_agent_firm_date: [{value: null, disabled: true}, []],
        text_acknowledge_seller_agent: [null, []],
        text_acknowledge_seller_agent_lic: [{value: SA.licenseCode, disabled: true}, []],
        date_acknowledge_seller_agent_date: [null, []],
      }),
      page_4: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
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
        date_date_prepared: [{value: this.offer.createdAt, disabled: true}, []],
        text_offer_buyer_customer: [{value: `${buyer.firstName} ${buyer.lastName}`, disabled: true}, []],
        text_offer_street_name: [{value: this.offer.streetName, disabled: true}, []],
        text_offer_city: [{value: this.offer.city, disabled: true}, []],
        text_offer_country: [{value: this.offer.state, disabled: true}, []],
        text_offer_zip_code: [{value: this.offer.zip, disabled: true}, []],
        text_offer_apn: [{value: this.offer.apn, disabled: true}, []],
        text_offer_price_text: [{value: null, disabled: true}, []],
        // # Price = 51c
        text_offer_price_digits: [null, [Validators.required]],
        // # Close of Escrow = 51d
        radio_escrow: ['date', []],
        date_escrow_date: [null, [Validators.required]],
        text_escrow_days: [{value: this.offer.closeEscrowDays, disabled: true}, []],
        check_agency_disclosure: [null, []],
        text_agency_broker_seller_firm: [{value: SA.companyName, disabled: true}, []],
        text_agency_broker_seller_firm_lic: [{value: SA.licenseCode, disabled: true}, []],
        check_agency_broker_of_seller: [{value: true, disabled: true}, []],
        check_agency_broker_seller_both: [{value: null, disabled: true}, []],
        text_agency_broker_seller_agent: [{value: `${SA.firstName} ${SA.lastName}`, disabled: true}, []],
        text_agency_broker_seller_agent_lic: [{value: SA.licenseCode, disabled: true}, []],
        check_agency_broker_seller_agent: [{value: true, disabled: true}, []],
        check_agency_broker_seller_dual: [{value: null, disabled: true}, []],
        text_agency_broker_buyer_firm: [{value: buyer.companyName, disabled: true}, []],
        text_agency_broker_buyer_firm_lic: [{value: buyer.licenseCode, disabled: true}, []],
        check_agency_broker_of_buyer: [{value: true, disabled: true}, []],
        check_agency_broker_buyer_both: [{value: null, disabled: true}, []],
        text_agency_broker_buyer_agent: [{value: `${BA.firstName} ${BA.lastName}`, disabled: true}, []],
        text_agency_broker_buyer_agent_lic: [{value: BA.licenseCode, disabled: true}, []],
        check_agency_broker_buyer_agent: [{value: true, disabled: true}, []],
        check_agency_broker_buyer_dual: [{value: null, disabled: true}, []],
        check_agency_competing_buyers_and_sellers: [null, []],
        // # Deposit = 53a
        text_finance_terms_amount: [null, [Validators.required]],
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
        text_finance_first_loan_amount: [null, [Validators.required]],
        text_finance_second_loan_amount: [null, []],
        // # Loan Amount = loan1 + loan2 (3d1,3d2)
        text_finance_additional_terms: [null, []],
        // # Down Payment = formula = price - (initial deposits + all loans (3a…3d))
        text_finance_down_payment_balance: [{value: null, disabled: true}, [Validators.required]],
        text_finance_additional_terms_amount: [{value: this.offer.price, disabled: true}, []],
        text_finance_buyer_initials_first: [null, []],
        text_finance_buyer_initials_second: [null, []],
        text_finance_seller_initials_first: [null, []],
        text_finance_seller_initials_second: [null, []],
      }),
      page_6: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
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
        radio_allocation_report_first: ['buyer', []],
        check_allocation_report_tax: [null, []],
        check_allocation_report_environmental: [null, []],
        check_allocation_report_other: [null, []],
        text_allocation_report_other: [null, []],
        text_allocation_report_prepared_by_first: [null, []],
        radio_allocation_report_second: ['buyer', []],
        text_allocation_report_following_first: [null, []],
        text_allocation_report_prepared_by_second: [null, []],
        radio_allocation_report_third: ['buyer', []],
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
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
        radio_pay_government: ['buyer', []],
        radio_pay_government_coe: ['buyer', []],
        radio_escrow_pay: ['buyer', []],
        text_escrow_pay_amount: [null, []],
        text_escrow_holder: [null, []],
        text_escrow_payment_days: [null, []],
        radio_escrow_pay_insurance: ['buyer', []],
        text_escrow_paragraph_13: [null, []],
        text_escrow_owner_title_issued_by: [null, []],
        radio_other_costs_country_tax: ['buyer', []],
        text_other_costs_country_tax_amount: [null, []],
        radio_other_costs_city_tax: ['buyer', []],
        text_other_costs_country_city_amount: [null, []],
        radio_other_costs_hometown_tax: ['buyer', []],
        text_other_costs_country_hometown_amount: [null, []],
        radio_other_costs_hao_fee: ['buyer', []],
        radio_other_costs_private_fee: ['buyer', []],
        text_other_costs_private_fee_amount: [null, []],
        radio_other_costs_shall_pay_first: ['buyer', []],
        text_other_costs_shall_pay_amount_first: [null, []],
        radio_other_costs_shall_pay_second: ['buyer', []],
        text_other_costs_shall_pay_amount_second: [null, []],
        radio_other_costs_shall_pay_cost: ['buyer', []],
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
        radio_possession_deliver_time_ampm: ['am', []],
        check_possession_deliver_no_later_than: [null, []],
        text_possession_deliver_no_later_than: [null, []],
        check_possession_deliver_at: [null, []],
        text_possession_deliver_at: [null, []],
        radio_possession_deliver_at_ampm: ['am', []],
        date_possession_deliver: [null, []],
        text_possession_deliver_buyer_initials_first: [null, []],
        text_possession_deliver_buyer_initials_second: [null, []],
        text_possession_deliver_seller_initials_first: [null, []],
        text_possession_deliver_seller_initials_second: [null, []],
      }),
      page_8: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
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
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
        text_seller_request_days: [null, []],
        text_buyer_initials_first: [null, []],
        text_buyer_initials_second: [null, []],
        text_seller_initials_first: [null, []],
        text_seller_initials_second: [null, []],
      }),
      page_10: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
        text_seller_deliver_reports_days: [null, []],
        text_seller_days_after_acceptance: [null, []],
        text_buyer_days_after_delivery: [null, []],
        text_buyer_investigate_property_days: [null, []],
        check_remove_all_contingencies: [null, []],
        text_notice_buyer_or_seller_to_perform: [null, []],
        text_days_to_close_escrow: [null, []],
        text_buyer_initials_first: [null, []],
        text_buyer_initials_second: [null, []],
        text_seller_initials_first: [null, []],
        text_seller_initials_second: [null, []],
      }),
      page_11: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
        text_property_verification_days: [null, []],
        text_escrow_holder_pay_days: [null, []],
        text_agreement_copy_deliver_days: [null, []],
        text_buyer_initials_first: [null, []],
        text_buyer_initials_second: [null, []],
        text_seller_initials_first: [null, []],
        text_seller_initials_second: [null, []],
      }),
      page_12: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
        text_first_buyer_initials_first: [null, []],
        text_first_buyer_initials_second: [null, []],
        text_first_seller_initials_first: [null, []],
        text_first_seller_initials_second: [null, []],
        text_second_buyer_initials_first: [null, []],
        text_second_buyer_initials_second: [null, []],
        text_second_seller_initials_first: [null, []],
        text_second_seller_initials_second: [null, []],
        text_third_buyer_initials_first: [null, []],
        text_third_buyer_initials_second: [null, []],
        text_third_seller_initials_first: [null, []],
        text_third_seller_initials_second: [null, []],
      }),
      page_13: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
        text_signed_copy_received_by: [null, []],
        check_received_on_time: [null, []],
        text_received_on_time: [null, []],
        radio_received_on_time_ampm: ['am', []],
        date_received_on_date: [null, []],
        check_one_more_buyer: [null, []],
        date_other_buyer_first: [null, []],
        text_other_buyer_first: [{value: `${buyer && buyer.firstName} ${buyer && buyer.lastName}`, disabled: true}, []],
        text_other_buyer_print_name_first: [null, []],
        date_other_buyer_second: [{value: null, disabled: true}, []],
        text_other_buyer_second:
          [{value: `${buyerSecond && buyerSecond.firstName} ${buyerSecond && buyerSecond.lastName}`, disabled: true}, []],
        text_other_buyer_print_name_second: [null, []],
        check_additional_signature_attached: [null, []],
        text_buyer_initials_first: [null, []],
        text_buyer_initials_second: [null, []],
        text_seller_initials_first: [null, []],
        text_seller_initials_second: [null, []],
      }),
      page_14: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
        date_property_date: [{value: this.offer.createdAt, disabled: true}, []],
        check_seller_acceptance_attached: [null, []],
        check_one_or_more_seller: [null, []],
        text_one_or_more_seller: [null, []],
        date_seller_first: [null, []],
        text_seller_first: [{value: `${seller && seller.firstName} ${seller && seller.lastName}`, disabled: true}, []],
        text_seller_print_name_first: [null, []],
        date_seller_second: [null, []],
        text_seller_second:
          [{value: `${sellerSecond && sellerSecond.firstName} ${sellerSecond && sellerSecond.lastName}`, disabled: true}, []],
        text_seller_print_name_second: [null, []],
        check_seller_additional_signature: [null, []],
        text_seller_initials_first: [null, []],
        text_seller_initials_second: [null, []],
        date_acceptance_received_date: [null, []],
        text_acceptance_received_time: [null, []],
        radio_acceptance_received_time_ampm: ['am', []],
        text_buyers_brokerage_firm: [{value: buyer.companyName, disabled: true}, []],
        text_buyers_brokerage_firm_lic: [{value: buyer.licenseCode, disabled: true}, []],
        text_buyers_brokerage_firm_by_first: [null, []],
        text_buyers_brokerage_firm_lic_by_first: [{value: buyer.licenseCode, disabled: true}, []],
        date_buyers_brokerage_firm_date_first: [null, []],
        text_buyers_brokerage_firm_by_second: [null, []],
        text_buyers_brokerage_firm_lic_by_second: [{value: buyerSecond && buyerSecond.licenseCode, disabled: true}, []],
        date_buyers_brokerage_firm_date_second: [null, []],
        text_buyers_address_street: [{value: this.offer.streetName, disabled: true}, []],
        text_buyers_address_city: [{value: this.offer.city, disabled: true}, []],
        text_buyers_address_state: [{value: 'California', disabled: true}, []],
        text_buyers_address_zip: [{value: this.offer.zip, disabled: true}, []],
        text_buyers_phone: [{value: buyer.phoneNumber, disabled: true}, []],
        text_buyers_fax: [{value: buyer.phoneNumber, disabled: true}, []],
        text_buyers_email: [{value: buyer.email, disabled: true}, []],
        text_seller_brokerage_firm: [{value: seller.companyName, disabled: true}, []],
        text_seller_brokerage_firm_lic: [{value: seller.licenseCode, disabled: true}, []],
        text_seller_brokerage_firm_by_first: [null, []],
        text_seller_brokerage_firm_lic_by_first: [{value: seller.licenseCode, disabled: true}, []],
        date_seller_brokerage_firm_date_first: [null, []],
        text_seller_brokerage_firm_by_second: [null, []],
        text_seller_brokerage_firm_lic_by_second: [{value: sellerSecond && sellerSecond.licenseCode, disabled: true}, []],
        date_seller_brokerage_firm_date_second: [null, []],
        text_seller_address_street: [{value: this.offer.streetName, disabled: true}, []],
        text_seller_address_city: [{value: this.offer.city, disabled: true}, []],
        text_seller_address_state: [{value: 'California', disabled: true}, []],
        text_seller_address_zip: [{value: this.offer.zip, disabled: true}, []],
        text_seller_phone: [{value: seller.phoneNumber, disabled: true}, []],
        text_seller_fax: [{value: seller.phoneNumber, disabled: true}, []],
        text_seller_email: [{value: seller.email, disabled: true}, []],
        check_escrow_deposit_amount: [null, []],
        text_escrow_deposit_amount: [null, []],
        text_counter_offer_numbers: [null, []],
        check_seller_statement_information: [null, []],
        text_seller_statement_information: [null, []],
        date_confirmation_of_acceptance: [null, []],
        text_escrow_holder: [null, []],
        text_escrow_number: [null, []],
        text_escrow_by: [null, []],
        date_escrow_by_date: [null, []],
        text_escrow_address: [null, []],
        text_escrow_phone_fax_email: [null, []],
        text_escrow_holder_license_number: [null, []],
        check_department_business: [null, []],
        check_department_insurance: [null, []],
        check_department_real_estate: [null, []],
        text_broker_designee_initials: [null, []],
        date_presentation_of_offer: [null, []],
        text_rejection_offer_seller_initial_first: [null, []],
        text_rejection_offer_seller_initial_second: [null, []],
        date_rejection_offer_date: [null, []],
        text_rejection_offer_buyer_initial_first: [null, []],
        text_rejection_offer_buyer_initial_second: [null, []],
      }),
      page_15: this.fb.group({
        text_property_address: [{value: fullAddress, disabled: true}, []],
        text_buyer_signature_first: [null, []],
        text_buyer_signature_second: [null, []],
      }),
      page_16: this.fb.group({
        text_privacy_act_advisory_first: [null, []],
        date_privacy_act_advisory_first: [null, []],
        text_privacy_act_advisory_second: [null, []],
        date_privacy_act_advisory_second: [null, []],
      }),
    }, {updateOn: 'blur'});

    this.offerService.getOfferDocument(this.offerId)
      .pipe(
        takeUntil(this.onDestroyed$),
      )
      .subscribe((model) => {
        this.patchForm(model);
        this.applyOfferFields();
        this.getAllFieldsCount(model);
        this.updatePageProgress(model, 0);
      });

    this.initPageBreakers();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
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

  acceptOfferDocument() {
    this.documentForm.markAllAsTouched();

    this.documentForm.invalid
      ? this.snackbar.open('Please, fill all mandatory fields')
      : this.offerService.updateOfferProgress({progress: 3}, this.offerId)
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe(() => {
          this.router.navigate([`portal/purchase-agreement/${this.offerId}/step-three`]);
        });
  }

  private patchForm(model) {
    // TODO: refactor
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

  private applyOfferFields() {
  }

  private getAllFieldsCount(model) {
    Object.keys(model).forEach((page) => {
      this.allFieldsCount += Object.keys(model[page]).length;
    });
  }

  private updatePageProgress(formObj, pageNum) {
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

  private detectPageChange(currentScrollPosition: number) {
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

  private subscribeToFormChanges() {
    Object.values(this.documentForm.controls).forEach((group: FormGroup, groupIndex: number) => {
      Object.values(group.controls).forEach((control: FormControl, controlIndex: number) => {
        control.valueChanges
          .pipe(
            debounceTime(200),
            takeUntil(this.onDestroyed$),
          )
          .subscribe((controlValue) => {
            this.documentInputChanged(Object.keys(group.getRawValue())[controlIndex], controlValue, group, groupIndex);
          });
      });
    });
  }

  private documentInputChanged(controlName: string, controlValue: any, group: FormGroup, groupIndex: number) {
    if (controlValue === '') {
      controlValue = null;
    } else if (controlValue instanceof Date) {
      controlValue = this.datePipe.transform(controlValue, 'yyyy-MM-dd');
    }
    // show saving animation if it takes a time
    this.offerService.updateOfferDocumentField({offerId: this.offerId, page: groupIndex + 1}, {[controlName]: controlValue})
      .pipe(
        takeUntil(this.onDestroyed$),
      )
      .subscribe(() => {
        this.updatePageProgress(this.documentForm.getRawValue(), this.currentPage);

        if (_.includes(this.downPaymentAmountPredicates, controlName)) {
          this.updateDownPaymentAmount();
        }
      });
  }

  private initPageBreakers() {
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

  private openSaveOfferDialog(changedOfferModel: Offer) {
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

  private saveOffer(model: Offer): Observable<Offer> {
    return this.offerService.update(model);
  }

  updateEscrowFields(value) {
    switch (value) {
      case 'date':
        this.documentForm.get('page_5.date_escrow_date').enable({emitEvent: false});
        this.documentForm.get('page_5.text_escrow_days').disable({emitEvent: false});
        this.documentForm.get('page_5.date_escrow_date').setValidators([Validators.required]);
        this.documentForm.get('page_5.text_escrow_days').clearValidators();
        break;
      case 'days':
        this.documentForm.get('page_5.text_escrow_days').enable({emitEvent: false});
        this.documentForm.get('page_5.date_escrow_date').disable({emitEvent: false});
        this.documentForm.get('page_5.text_escrow_days').setValidators([Validators.required]);
        this.documentForm.get('page_5.date_escrow_date').clearValidators();
        break;
    }

    this.documentForm.get('page_5.date_escrow_date').patchValue('', {emitEvent: false, onlySelf: true});
    this.documentForm.get('page_5.text_escrow_days').patchValue('', {emitEvent: false, onlySelf: true});
  }

  private updateDownPaymentAmount() {
    const price = +this.documentForm.get('page_5.text_offer_price_digits').value || 0;
    const initialDeposits = +this.documentForm.get('page_5.text_finance_terms_amount').value || 0;
    const loans = +(this.documentForm.get('page_5.text_finance_first_loan_amount').value || 0) +
      +(this.documentForm.get('page_5.text_finance_second_loan_amount').value || 0);

    return this.documentForm.get('page_5.text_finance_down_payment_balance')
      .patchValue((price - (initialDeposits + loans)).toFixed(2));
  }
}
