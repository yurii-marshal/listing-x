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
import { User } from '../../../auth/models';
import { AuthService } from '../../../../core-modules/core-services/auth.service';

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

  private user: User;

  private isDisabled: boolean;

  private onDestroyed$: Subject<void> = new Subject<void>();

  private pageBreakersOffsetTop: number[];
  private documentFormEl: EventTarget;

  private signFieldElements: any[] = [];

  private downPaymentAmountPredicates: string[] = [
    'text_offer_price_digits',
    'text_finance_terms_amount',
    'text_finance_increased_deposit_amount',
    'text_finance_first_loan_amount',
    'text_finance_second_loan_amount',
  ];

  constructor(
    private offerService: OfferService,
    private dialog: MatDialog,
    private router: Router,
    public route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private elRef: ElementRef,
    private datePipe: DatePipe,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.id;
    this.offer = this.route.snapshot.data.offer;

    this.user = this.authService.currentUser;

    //  || this.route.snapshot.routeConfig.path === 'sign'
    this.isDisabled = this.offer.userRole !== 'agent_buyer';

    this.documentForm = this.fb.group({
      page_1: this.fb.group({
        check_civil_code: [{value: null, disabled: this.isDisabled}, []],
        radio_disclosure_1: [{value: 'buyer', disabled: true}, []],
        text_disclosure_role_name_1: this.getSignFieldAllowedFor('buyers', 0),
        date_disclosure_1: this.getSignFieldAllowedFor('buyers', 0),
        radio_disclosure_2: [{value: 'buyer', disabled: true}, []],
        text_disclosure_role_name_2: this.getSignFieldAllowedFor('buyers', 1),
        date_disclosure_2: this.getSignFieldAllowedFor('buyers', 1),
        text_disclosure_firm: [{value: null, disabled: this.isDisabled}, []],
        text_disclosure_firm_lic: [{value: '', disabled: true}, []],
        text_disclosure_agent_buyer: this.getSignFieldAllowedFor('agentBuyers', 0),
        text_disclosure_agent_buyer_lic: [{value: '', disabled: true}, []],
        date_disclosure_3: this.getSignFieldAllowedFor('agentBuyers', 0),
      }),
      page_2: this.fb.group({
        text_confirm_seller_firm_name: [{value: '', disabled: true}, []],
        text_confirm_seller_firm_lic: [{value: '', disabled: true}, []],
        radio_confirm_seller: [{value: 'seller', disabled: true}, []],
        text_confirm_seller_agent_firm_name: [{value: '', disabled: true}, []],
        text_confirm_seller_agent_firm_lic: [{value: '', disabled: true}, []],
        radio_confirm_seller_agent: [{value: 'seller_agent', disabled: true}, []],
        text_confirm_buyer_firm_name: [{value: '', disabled: true}, []],
        text_confirm_buyer_firm_lic: [{value: '', disabled: true}, []],
        radio_confirm_buyer: [{value: 'buyer', disabled: true}, []],
        text_confirm_buyer_agent_firm_name: [{value: '', disabled: true}, []],
        text_confirm_buyer_agent_firm_lic: [{value: '', disabled: true}, []],
        radio_confirm_buyer_agent: [{value: 'buyer_agent', disabled: true}, []],
      }),
      page_3: this.fb.group({
        text_acknowledge_seller_1: this.getSignFieldAllowedFor('sellers', 0),
        date_acknowledge_seller_1: this.getSignFieldAllowedFor('sellers', 0),
        text_acknowledge_seller_2: this.getSignFieldAllowedFor('sellers', 1),
        date_acknowledge_seller_2: this.getSignFieldAllowedFor('sellers', 1),
        text_acknowledge_buyer_1: this.getSignFieldAllowedFor('buyers', 0),
        date_acknowledge_buyer_1: this.getSignFieldAllowedFor('buyers', 0),
        text_acknowledge_buyer_2: this.getSignFieldAllowedFor('buyers', 1),
        date_acknowledge_buyer_2: this.getSignFieldAllowedFor('buyers', 1),
        text_acknowledge_buyer_agent_firm: [{value: '', disabled: true}, []],
        text_acknowledge_buyer_agent_firm_lic: [{value: '', disabled: true}, []],
        // date_acknowledge_buyer_agent_firm_date: [{value: '', disabled: true}, []],
        text_acknowledge_buyer_agent: this.getSignFieldAllowedFor('agentBuyers', 0),
        text_acknowledge_buyer_agent_lic: [{value: '', disabled: true}, []],
        date_acknowledge_buyer_agent_date: this.getSignFieldAllowedFor('agentBuyers', 0),
        text_acknowledge_seller_agent_firm: [{value: '', disabled: true}, []],
        text_acknowledge_seller_agent_firm_lic: [{value: '', disabled: true}, []],
        // date_acknowledge_seller_agent_firm_date: this.getSignFieldAllowedFor('agentSellers', 0),
        text_acknowledge_seller_agent: this.getSignFieldAllowedFor('agentSellers', 0),
        text_acknowledge_seller_agent_lic: [{value: '', disabled: true}, []],
        date_acknowledge_seller_agent_date: this.getSignFieldAllowedFor('agentSellers', 0),
      }),
      page_4: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        text_buyer_tenant_1: this.getSignFieldAllowedFor('buyers', 0),
        date_buyer_tenant_1: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_tenant_2: this.getSignFieldAllowedFor('buyers', 1),
        date_buyer_tenant_2: this.getSignFieldAllowedFor('buyers', 1),
        text_seller_landlord_1: this.getSignFieldAllowedFor('sellers', 0),
        date_seller_landlord_1: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_landlord_2: this.getSignFieldAllowedFor('sellers', 1),
        date_seller_landlord_2: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_5: this.fb.group({
        date_date_prepared: [{value: '', disabled: true}, []],
        text_offer_buyer_customer: [{value: '', disabled: true}, []],
        text_offer_street_name: [{value: '', disabled: true}, []],
        text_offer_city: [{value: '', disabled: true}, []],
        text_offer_country: [{value: '', disabled: true}, []],
        text_offer_zip_code: [{value: '', disabled: true}, []],
        text_offer_apn: [{value: '', disabled: true}, []],
        text_offer_price_text: [{value: null, disabled: true}, []],
        // # Price = 51c
        text_offer_price_digits: [{value: null, disabled: this.isDisabled}, [Validators.required]],
        // # Close of Escrow = 51d
        radio_escrow: [{value: 'date', disabled: this.isDisabled}, []],
        date_escrow_date: [{value: null, disabled: this.isDisabled}, [Validators.required]],
        text_escrow_days: [{value: '', disabled: true}, []],
        check_agency_disclosure: [{value: null, disabled: this.isDisabled}, []],
        text_agency_broker_seller_firm: [{value: '', disabled: true}, []],
        text_agency_broker_seller_firm_lic: [{value: '', disabled: true}, []],
        radio_agency_broker_seller: [{value: 'seller', disabled: true}, []],
        text_agency_broker_seller_agent: [{value: '', disabled: true}, []],
        text_agency_broker_seller_agent_lic: [{value: '', disabled: true}, []],
        radio_agency_broker_seller_agent: [{value: 'seller_agent', disabled: true}, []],
        text_agency_broker_buyer_firm: [{value: '', disabled: true}, []],
        text_agency_broker_buyer_firm_lic: [{value: '', disabled: true}, []],
        radio_agency_broker_buyer: [{value: 'buyer', disabled: true}, []],
        text_agency_broker_buyer_agent: [{value: '', disabled: true}, []],
        text_agency_broker_buyer_agent_lic: [{value: '', disabled: true}, []],
        radio_agency_broker_buyer_agent: [{value: 'buyer_agent', disabled: true}, []],
        check_agency_competing_buyers_and_sellers: [{value: null, disabled: this.isDisabled}, []],
        // # Deposit = 53a
        text_finance_terms_amount: [{value: null, disabled: this.isDisabled}, [Validators.required]],
        check_finance_buyer_cashier_check: [{value: null, disabled: this.isDisabled}, []],
        check_finance_buyer_personal_check: [{value: null, disabled: this.isDisabled}, []],
        check_finance_buyer_other_check: [{value: null, disabled: this.isDisabled}, []],
        text_finance_buyer_other_details: [{value: null, disabled: this.isDisabled}, []],
        text_finance_countdown_alternative: [{value: null, disabled: this.isDisabled}, []],
        check_finance_buyer_deposit_agent: [{value: null, disabled: this.isDisabled}, []],
        text_finance_buyer_deposit_check: [{value: null, disabled: this.isDisabled}, []],
        text_finance_submit_to_agent_alt: [{value: null, disabled: this.isDisabled}, []],
        text_finance_payable_to: [{value: null, disabled: this.isDisabled}, []],
        text_finance_deposit_countdown_alt: [{value: null, disabled: this.isDisabled}, []],
        text_finance_increase_deposit_countdown: [{value: null, disabled: this.isDisabled}, []],
        text_finance_increase_deposit_countdown_alt: [{value: null, disabled: this.isDisabled}, []],
        text_finance_increased_deposit_amount: [{value: null, disabled: this.isDisabled}, []],
        check_finance_all_cash_offer: [{value: null, disabled: this.isDisabled}, []],
        check_finance_attach_to_buyer_shall: [{value: null, disabled: this.isDisabled}, []],
        text_finance_verification_deliver_countdown: [{value: null, disabled: this.isDisabled}, []],
        check_finance_loan_type_fha: [{value: null, disabled: this.isDisabled}, []],
        check_finance_loan_type_va: [{value: null, disabled: this.isDisabled}, []],
        check_finance_loan_type_seller: [{value: null, disabled: this.isDisabled}, []],
        check_finance_loan_type_assumed: [{value: null, disabled: this.isDisabled}, []],
        check_finance_loan_type_other: [{value: null, disabled: this.isDisabled}, []],
        text_finance_loan_type_other_details: [{value: null, disabled: this.isDisabled}, []],
        text_finance_loan_max_percent: [{value: null, disabled: this.isDisabled}, []],
        check_finance_first_loan_adjustable: [{value: null, disabled: this.isDisabled}, []],
        text_finance_loan_initial_rate: [{value: null, disabled: this.isDisabled}, []],
        text_finance_loan_max_pay_points: [{value: null, disabled: this.isDisabled}, []],
        check_finance_second_loan_amount: [{value: null, disabled: this.isDisabled}, []],
        check_finance_second_loan_type_seller: [{value: null, disabled: this.isDisabled}, []],
        check_finance_second_loan_type_assumed: [{value: null, disabled: this.isDisabled}, []],
        check_finance_second_loan_type_other: [{value: null, disabled: this.isDisabled}, []],
        text_finance_second_loan_type_other_details: [{value: null, disabled: this.isDisabled}, []],
        text_finance_second_loan_max_percent: [{value: null, disabled: this.isDisabled}, []],
        check_finance_second_loan_adjustable: [{value: null, disabled: this.isDisabled}, []],
        text_finance_second_loan_initial_rate: [{value: null, disabled: this.isDisabled}, []],
        text_finance_second_loan_max_pay_points: [{value: null, disabled: this.isDisabled}, []],
        text_finance_written_notice_delivery_days: [{value: null, disabled: this.isDisabled}, []],
        text_finance_first_loan_amount: [{value: null, disabled: this.isDisabled}, [Validators.required]],
        text_finance_second_loan_amount: [{value: null, disabled: this.isDisabled}, []],
        // # Loan Amount = loan1 + loan2 (3d1,3d2)
        text_finance_additional_terms: [{value: null, disabled: this.isDisabled}, []],
        // # Down Payment = formula = price - (initial deposits + all loans (3a…3d))
        text_finance_down_payment_balance: [{value: null, disabled: true}, [Validators.required]],
        // text_finance_additional_terms_amount: [{value: null, disabled: true}, []],
        text_finance_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_finance_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_finance_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_finance_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_6: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        text_closing_cost_countdown_alt: [{value: null, disabled: this.isDisabled}, []],
        check_closing_cost_verification_attached: [{value: null, disabled: this.isDisabled}, []],
        check_appraisal_agreement: [{value: null, disabled: this.isDisabled}, []],
        text_appraisal_contingency_canceling_days: [{value: null, disabled: this.isDisabled}, []],
        text_loan_terms_application_days: [{value: null, disabled: this.isDisabled}, []],
        check_loan_terms_letter_attached: [{value: null, disabled: this.isDisabled}, []],
        text_loan_terms_contingency_removal_days: [{value: null, disabled: this.isDisabled}, []],
        check_no_loan_contingency: [{value: null, disabled: this.isDisabled}, []],
        check_sale_of_buyers_property: [{value: null, disabled: this.isDisabled}, []],
        check_addenda_addendum: [{value: null, disabled: this.isDisabled}, []],
        check_addenda_back_up_offer: [{value: null, disabled: this.isDisabled}, []],
        check_addenda_court_confirmation: [{value: null, disabled: this.isDisabled}, []],
        check_addenda_septic: [{value: null, disabled: this.isDisabled}, []],
        check_addenda_short_sale: [{value: null, disabled: this.isDisabled}, []],
        check_addenda_other: [{value: null, disabled: this.isDisabled}, []],
        check_advisories_buyers_inspection: [{value: null, disabled: this.isDisabled}, []],
        check_advisories_probate_advisories: [{value: null, disabled: this.isDisabled}, []],
        check_advisories_statewide_buyers: [{value: null, disabled: this.isDisabled}, []],
        check_advisories_trust_advisory: [{value: null, disabled: this.isDisabled}, []],
        check_advisories_reo_advisory: [{value: null, disabled: this.isDisabled}, []],
        check_advisories_short_sale: [{value: null, disabled: this.isDisabled}, []],
        check_advisories_other: [{value: null, disabled: this.isDisabled}, []],
        text_other_terms: [{value: null, disabled: this.isDisabled}, []],
        radio_allocation_report_first: [{value: 'buyer', disabled: this.isDisabled}, []],
        check_allocation_report_environmental: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_other: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_other: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_prepared_by_first: [{value: null, disabled: this.isDisabled}, []],
        radio_allocation_report_second: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_allocation_report_following_first: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_prepared_by_second: [{value: null, disabled: this.isDisabled}, []],
        radio_allocation_report_third: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_allocation_report_following_second: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_prepared_by_third: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_government_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_government_seller: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_allocation_report_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_allocation_report_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_allocation_report_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_7: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        radio_pay_government: [{value: 'buyer', disabled: this.isDisabled}, []],
        radio_pay_government_coe: [{value: 'buyer', disabled: this.isDisabled}, []],
        radio_escrow_pay: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_escrow_pay_amount: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_holder: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_payment_days: [{value: null, disabled: this.isDisabled}, []],
        radio_escrow_pay_insurance: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_escrow_paragraph_13: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_owner_title_issued_by: [{value: null, disabled: this.isDisabled}, []],
        radio_other_costs_country_tax: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_other_costs_country_tax_amount: [{value: null, disabled: this.isDisabled}, []],
        radio_other_costs_city_tax: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_other_costs_country_city_amount: [{value: null, disabled: this.isDisabled}, []],
        radio_other_costs_hometown_tax: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_other_costs_country_hometown_amount: [{value: null, disabled: this.isDisabled}, []],
        radio_other_costs_hao_fee: [{value: 'buyer', disabled: this.isDisabled}, []],
        radio_other_costs_private_fee: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_other_costs_private_fee_amount: [{value: null, disabled: this.isDisabled}, []],
        radio_other_costs_shall_pay_first: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_other_costs_shall_pay_amount_first: [{value: null, disabled: this.isDisabled}, []],
        radio_other_costs_shall_pay_second: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_other_costs_shall_pay_amount_second: [{value: null, disabled: this.isDisabled}, []],
        radio_other_costs_shall_pay_cost: [{value: 'buyer', disabled: this.isDisabled}, []],
        text_other_costs_shall_pay_amount_cost: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_warranty: [{value: null, disabled: this.isDisabled}, []],
        text_other_costs_warranty_issued_by: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_air_conditioner: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_pool: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_other: [{value: null, disabled: this.isDisabled}, []],
        text_other_costs_other_details: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_warranty_plan: [{value: null, disabled: this.isDisabled}, []],
        check_include_items_all_stoves: [{value: null, disabled: this.isDisabled}, []],
        text_include_items_all_stoves_except: [{value: null, disabled: this.isDisabled}, []],
        check_include_items_all_refrigerators: [{value: null, disabled: this.isDisabled}, []],
        text_include_items_all_refrigerators_except: [{value: null, disabled: this.isDisabled}, []],
        check_include_items_all_washers: [{value: null, disabled: this.isDisabled}, []],
        text_include_items_all_washers_except: [{value: null, disabled: this.isDisabled}, []],
        text_include_items_additional: [{value: null, disabled: this.isDisabled}, []],
        check_include_items_devices: [{value: null, disabled: this.isDisabled}, []],
        text_include_items_without_warranty: [{value: null, disabled: this.isDisabled}, []],
        text_exclude_from_sale: [{value: null, disabled: this.isDisabled}, []],
        check_exclude_from_sale: [{value: null, disabled: this.isDisabled}, []],
        check_closing_buyer_intend: [{value: null, disabled: this.isDisabled}, []],
        text_possession_deliver_time: [{value: null, disabled: this.isDisabled}, []],
        radio_possession_deliver_time_ampm: [{value: 'am', disabled: this.isDisabled}, []],
        check_possession_deliver_no_later_than: [{value: null, disabled: this.isDisabled}, []],
        text_possession_deliver_no_later_than: [{value: null, disabled: this.isDisabled}, []],
        check_possession_deliver_at: [{value: null, disabled: this.isDisabled}, []],
        text_possession_deliver_at: [{value: null, disabled: this.isDisabled}, []],
        radio_possession_deliver_at_ampm: [{value: 'am', disabled: this.isDisabled}, []],
        date_possession_deliver: [{value: null, disabled: this.isDisabled}, []],
        text_possession_deliver_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_possession_deliver_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_possession_deliver_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_possession_deliver_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_8: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        check_occupancy_agreement_car_form_sip: [{value: null, disabled: this.isDisabled}, []],
        check_occupancy_agreement_car_form_rlap: [{value: null, disabled: this.isDisabled}, []],
        text_property_vacant_days: [{value: null, disabled: this.isDisabled}, []],
        text_seller_disclosure_days: [{value: null, disabled: this.isDisabled}, []],
        check_tenant_to_remain: [{value: null, disabled: this.isDisabled}, []],
        text_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_9: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        text_seller_request_days: [{value: null, disabled: this.isDisabled}, []],
        text_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_10: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        text_seller_deliver_reports_days: [{value: null, disabled: this.isDisabled}, []],
        text_seller_days_after_acceptance: [{value: null, disabled: this.isDisabled}, []],
        text_buyer_days_after_delivery: [{value: null, disabled: this.isDisabled}, []],
        text_buyer_investigate_property_days: [{value: null, disabled: this.isDisabled}, []],
        check_remove_all_contingencies: [{value: null, disabled: this.isDisabled}, []],
        text_notice_buyer_or_seller_to_perform: [{value: null, disabled: this.isDisabled}, []],
        text_days_to_close_escrow: [{value: null, disabled: this.isDisabled}, []],
        text_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_11: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        text_property_verification_days: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_holder_pay_days: [{value: null, disabled: this.isDisabled}, []],
        date_agreement_copy_deliver_date: [{value: null, disabled: this.isDisabled}, []],
        text_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_12: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        text_first_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_first_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_first_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_first_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
        text_second_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_second_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_second_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_second_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
        text_third_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_third_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_third_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_third_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_13: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        text_signed_copy_received_by: [{value: null, disabled: this.isDisabled}, []],
        check_received_on_time: [{value: null, disabled: this.isDisabled}, []],
        text_received_on_time: [{value: null, disabled: this.isDisabled}, []],
        radio_received_on_time_ampm: [{value: 'am', disabled: this.isDisabled}, []],
        date_received_on_date: [{value: null, disabled: this.isDisabled}, []],
        check_one_more_buyer: [{value: null, disabled: this.isDisabled}, []],
        text_other_buyer_first: this.getSignFieldAllowedFor('buyers', 0),
        date_other_buyer_first: this.getSignFieldAllowedFor('buyers', 0),
        text_other_buyer_print_name_first: [{value: null, disabled: this.isDisabled}, []],
        date_other_buyer_second: this.getSignFieldAllowedFor('buyers', 1),
        text_other_buyer_second: this.getSignFieldAllowedFor('buyers', 1),
        text_other_buyer_print_name_second: [{value: null, disabled: this.isDisabled}, []],
        check_additional_signature_attached: [{value: null, disabled: this.isDisabled}, []],
        text_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
      }),
      page_14: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        date_property_date: [{value: '', disabled: true}, []],
        check_seller_acceptance_attached: [{value: null, disabled: this.isDisabled}, []],
        check_one_or_more_seller: [{value: null, disabled: this.isDisabled}, []],
        date_one_or_more_seller: [{value: null, disabled: this.isDisabled}, []],
        date_seller_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_print_name_first: [{value: null, disabled: this.isDisabled}, []],
        date_seller_second: this.getSignFieldAllowedFor('sellers', 1),
        text_seller_second: this.getSignFieldAllowedFor('sellers', 1),
        text_seller_print_name_second: [{value: null, disabled: this.isDisabled}, []],
        check_seller_additional_signature: [{value: null, disabled: this.isDisabled}, []],
        text_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
        date_acceptance_received_date: [{value: null, disabled: this.isDisabled}, []],
        text_acceptance_received_time: [{value: null, disabled: this.isDisabled}, []],
        radio_acceptance_received_time_ampm: [{value: 'am', disabled: this.isDisabled}, []],
        text_buyers_brokerage_firm: [{value: '', disabled: true}, []],
        text_buyers_brokerage_firm_lic: [{value: '', disabled: true}, []],
        text_buyers_brokerage_firm_by_first: this.getSignFieldAllowedFor('agentBuyers', 0),
        text_buyers_brokerage_firm_lic_by_first: [{value: '', disabled: true}, []],
        date_buyers_brokerage_firm_date_first: this.getSignFieldAllowedFor('agentBuyers', 0),
        text_buyers_brokerage_firm_by_second: this.getSignFieldAllowedFor('agentBuyers', 1),
        text_buyers_brokerage_firm_lic_by_second: [{value: '', disabled: true}, []],
        date_buyers_brokerage_firm_date_second: this.getSignFieldAllowedFor('agentBuyers', 1),
        text_buyers_address_street: [{value: '', disabled: true}, []],
        text_buyers_address_city: [{value: '', disabled: true}, []],
        text_buyers_address_state: [{value: 'California', disabled: true}, []],
        text_buyers_address_zip: [{value: '', disabled: true}, []],
        text_buyers_phone: [{value: '', disabled: true}, []],
        text_buyers_fax: [{value: '', disabled: true}, []],
        text_buyers_email: [{value: '', disabled: true}, []],
        text_seller_brokerage_firm: [{value: '', disabled: true}, []],
        text_seller_brokerage_firm_lic: [{value: '', disabled: true}, []],
        text_seller_brokerage_firm_by_first: this.getSignFieldAllowedFor('agentSellers', 0),
        text_seller_brokerage_firm_lic_by_first: [{value: '', disabled: true}, []],
        date_seller_brokerage_firm_date_first: this.getSignFieldAllowedFor('agentSellers', 0),
        text_seller_brokerage_firm_by_second: this.getSignFieldAllowedFor('agentSellers', 1),
        text_seller_brokerage_firm_lic_by_second: [{value: '', disabled: true}, []],
        date_seller_brokerage_firm_date_second: this.getSignFieldAllowedFor('agentSellers', 1),
        text_seller_address_street: [{value: '', disabled: true}, []],
        text_seller_address_city: [{value: '', disabled: true}, []],
        text_seller_address_state: [{value: 'California', disabled: true}, []],
        text_seller_address_zip: [{value: '', disabled: true}, []],
        text_seller_phone: [{value: '', disabled: true}, []],
        text_seller_fax: [{value: '', disabled: true}, []],
        text_seller_email: [{value: '', disabled: true}, []],
        check_escrow_deposit_amount: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_deposit_amount: [{value: null, disabled: this.isDisabled}, []],
        text_counter_offer_numbers: [{value: null, disabled: this.isDisabled}, []],
        check_seller_statement_information: [{value: null, disabled: this.isDisabled}, []],
        text_seller_statement_information: [{value: null, disabled: this.isDisabled}, []],
        date_confirmation_of_acceptance: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_holder: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_number: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_by: [{value: null, disabled: this.isDisabled}, []],
        date_escrow_by_date: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_address: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_phone_fax_email: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_holder_license_number: [{value: null, disabled: this.isDisabled}, []],
        check_department_business: [{value: null, disabled: this.isDisabled}, []],
        check_department_insurance: [{value: null, disabled: this.isDisabled}, []],
        check_department_real_estate: [{value: null, disabled: this.isDisabled}, []],
        text_broker_designee_initials: [{value: null, disabled: this.isDisabled}, []],
        date_presentation_of_offer: [{value: null, disabled: this.isDisabled}, []],
        // TODO: reject offer signs scope 4.0
        text_rejection_offer_seller_initial_first: [{value: null, disabled: this.isDisabled}, []],
        text_rejection_offer_seller_initial_second: [{value: null, disabled: this.isDisabled}, []],
        date_rejection_offer_date: [{value: null, disabled: this.isDisabled}, []],
        //
        text_buyer_initial_first: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_initial_second: this.getSignFieldAllowedFor('buyers', 1),
      }),
      page_15: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        text_buyer_signature_first: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_signature_second: this.getSignFieldAllowedFor('buyers', 1),
      }),
      page_16: this.fb.group({
        text_privacy_act_advisory_first: this.getSignFieldAllowedFor('buyers', 0),
        date_privacy_act_advisory_first: this.getSignFieldAllowedFor('buyers', 0),
        text_privacy_act_advisory_second: this.getSignFieldAllowedFor('buyers', 1),
        date_privacy_act_advisory_second: this.getSignFieldAllowedFor('buyers', 1),
      }),
    }, {updateOn: 'blur'});

    this.offerService.getOfferDocument(this.offerId)
      .pipe(
        takeUntil(this.onDestroyed$),
      )
      .subscribe((model) => {
        this.patchForm(model);
        this.switchDaysAndDate(
          this.documentForm.get('page_5.radio_escrow').value,
          'page_5.text_escrow_days',
          'page_5.date_escrow_date'
        );
        this.getAllFieldsCount(model);
        this.updatePageProgress(model, 0);

        this.disableSignedFields();
        this.moveToNextSignField();
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

  continue() {
    this.documentForm.markAllAsTouched();

    const hasFormInvalidFields = this.scrollToFirstInvalidField();

    if (hasFormInvalidFields) {
      this.snackbar.open('Please, fill all mandatory fields');
    } else {
      if (this.route.snapshot.routeConfig.path === 'step-two') {
        this.offerService.updateOfferProgress({progress: 3}, this.offerId)
          .pipe(takeUntil(this.onDestroyed$))
          .subscribe(() => {
            this.router.navigate([`portal/purchase-agreement/${this.offerId}/step-three`]);
          });
      } else {
        this.router.navigate([`portal/purchase-agreement/${this.offerId}/details`]);
      }
    }
  }

  switchDaysAndDate(value: string, daysControlName: string, dateControlName: string) {
    switch (value) {
      case 'date':
        this.documentForm.get(dateControlName).enable({emitEvent: false});
        this.documentForm.get(dateControlName).markAsDirty();
        this.documentForm.get(daysControlName).disable({emitEvent: false});
        this.documentForm.get(dateControlName).setValidators([Validators.required]);
        this.documentForm.get(daysControlName).patchValue('');
        this.documentForm.get(daysControlName).clearValidators();
        break;
      case 'days':
        this.documentForm.get(daysControlName).enable({emitEvent: false});
        this.documentForm.get(daysControlName).markAsDirty();
        this.documentForm.get(dateControlName).disable({emitEvent: false});
        this.documentForm.get(daysControlName).setValidators([Validators.required]);
        this.documentForm.get(dateControlName).patchValue('');
        this.documentForm.get(dateControlName).clearValidators();
        break;
    }
  }

  moveToNextSignField() {
    if (this.signFieldElements.length) {
      for (const item of this.signFieldElements) {
        if (!item.value) {
          item.scrollIntoView({behavior: 'smooth', block: 'center'});
          item.focus();
          return;
        }
      }

      this.signAgreement();
    }
  }

  private scrollToFirstInvalidField(): boolean {
    for (const groupName of Object.keys(this.documentForm.controls)) {
      if (this.documentForm.controls[groupName].invalid) {
        for (const controlName of Object.keys((this.documentForm.controls[groupName] as FormGroup).controls)) {
          if (this.documentForm.get(`${groupName}.${controlName}`).invalid) {
            const invalidControl = this.elRef.nativeElement.querySelector('[formcontrolname="' + controlName + '"]');
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
                // TODO: check it in SRS
                // this.documentForm.get(`${groupName}.${_.snakeCase(field)}`)
                //   .disable({onlySelf: true, emitEvent: false});
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
            this.documentInputChanged(Object.keys(group.getRawValue())[controlIndex], controlValue, groupIndex);
          });
      });
    });
  }

  private documentInputChanged(controlName: string, controlValue: any, groupIndex: number) {
    if (controlValue === '') {
      controlValue = null;
    } else if (controlValue instanceof Date) {
      controlValue = this.datePipe.transform(controlValue, 'yyyy-MM-dd');
    } else if (+controlValue) {
      controlValue = String(controlValue).replace(',', '');
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

  private updateDownPaymentAmount() {
    const price = +this.documentForm.get('page_5.text_offer_price_digits').value || 0;
    const initialDeposits = +this.documentForm.get('page_5.text_finance_terms_amount').value || 0;
    const increasedDeposits = +this.documentForm.get('page_5.text_finance_increased_deposit_amount').value || 0;
    const loans = +(this.documentForm.get('page_5.text_finance_first_loan_amount').value || 0) +
      +(this.documentForm.get('page_5.text_finance_second_loan_amount').value || 0);

    return this.documentForm.get('page_5.text_finance_down_payment_balance')
      .patchValue((price - (initialDeposits + increasedDeposits + loans)).toFixed(2));
  }

  private getSignFieldAllowedFor(role: string, index: number) {
    const value = {
      value: '',
      disabled: this.offer[role][index] ? this.offer[role][index].email !== this.user.email : true,
    };
    // const validators = this.offer[role][index] ? (this.offer[role][index].email === this.user.email ? [Validators.required] : []) : [];

    return [value, []];
  }

  private disableSignedFields() {
    this.signFieldElements = Array.from(document.getElementsByClassName('sign-input'));
    this.signFieldElements.forEach(item => item.disabled = !!item.value);
  }

  private signAgreement() {
    this.offer.isSigned
      ? this.snackbar.open('Offer is already signed')
      : this.offerService.signOffer(this.offerId)
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe(() => this.snackbar.open('Offer is signed now'));
  }
}
