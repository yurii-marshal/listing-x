import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../../../core-modules/models/offer';
import { DateAdapter, MAT_DATE_FORMATS, MatDialog, MatSnackBar } from '@angular/material';
import { EditOfferDialogComponent } from '../../../../shared-modules/dialogs/edit-offer-dialog/edit-offer-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SaveOfferDialogComponent } from '../../../../shared-modules/dialogs/save-offer-dialog/save-offer-dialog.component';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { User } from '../../../auth/models';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { SignatureDirective } from '../../../../shared-modules/directives/signature.directive';
import { AgreementStatus } from '../../../../core-modules/models/agreement';
import { PICK_FORMATS, PickDateAdapter } from '../../../../core-modules/adapters/date-adapter';
import { FinishSigningDialogComponent } from '../../../../shared-modules/dialogs/finish-signing-dialog/finish-signing-dialog.component';
import { ProfileService } from '../../../../core-modules/core-services/profile.service';
import { CounterOfferService } from '../../services/counter-offer.service';
import { CounterOffer } from '../../../../core-modules/models/counter-offer';
import { CounterOfferType } from '../../../../core-modules/models/counter-offer-type';
import { GeneratedDocumentType } from '../../../../core-modules/enums/upload-document-type';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
  providers: [
    DatePipe,
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
  ]
})
export class StepTwoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('form', {static: true}) form: ElementRef;
  @ViewChildren(SignatureDirective) signatures: QueryList<SignatureDirective>;

  isLoading = true;
  isSignMode: boolean;

  okButtonText: string;

  documentForm: FormGroup;
  currentPage: number = 0;
  completedFieldsCount: number = 0;
  completedPageCount: number = 0;
  allFieldsCount: number = 0;
  allPageCount: number = 0;
  offerId: number;
  offer: Offer;

  currencyMaskOptions = {
    min: 0,
    max: 1000000000000,
    prefix: '',
    allowNegative: false,
    align: 'left',
  };

  datepickerMinDate: Date = new Date();

  additionalList = {
    'FHA/VA': false,
    CONTINGENCY: false,
    ADDENDA: false,
  };

  readonly AGREEMENT_PAGE_NUM = 16;
  additionalPageCount: number[] = [];

  isCountered: boolean;

  private user: User;
  private isDisabled: boolean;
  private onDestroyed$: Subject<void> = new Subject<void>();
  private pageBreakersOffsetTop: number[];
  private documentFormEl: EventTarget;
  private downPaymentAmountPredicates: string[] = [
    'text_offer_price_digits',
    'text_finance_terms_amount',
    'text_finance_increased_deposit_amount',
    'text_finance_first_loan_amount',
    'text_finance_second_loan_amount',
  ];

  constructor(
    public offerService: OfferService,
    public counterOfferService: CounterOfferService,
    private dialog: MatDialog,
    private router: Router,
    public route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private elRef: ElementRef,
    private datePipe: DatePipe,
    private authService: AuthService,
    private profileService: ProfileService,
    protected cdr: ChangeDetectorRef,
  ) {
  }

  private get formGroupPage(): FormGroup {
    return this.fb.group({
      page_1: this.fb.group({
        check_civil_code: [{value: null, disabled: this.isDisabled}, []],
        check_disclosure_1_buyer: [{value: true, disabled: true}, []],
        check_disclosure_1_seller: [{value: null, disabled: true}, []],
        check_disclosure_1_landlord: [{value: null, disabled: true}, []],
        check_disclosure_1_tenant: [{value: null, disabled: true}, []],
        text_disclosure_role_name_1: this.getSignFieldAllowedFor('buyers', 0),
        date_disclosure_1: [{value: '', disabled: true}, []],
        check_disclosure_2_buyer: [{value: true, disabled: true}, []],
        check_disclosure_2_seller: [{value: null, disabled: true}, []],
        check_disclosure_2_landlord: [{value: null, disabled: true}, []],
        check_disclosure_2_tenant: [{value: null, disabled: true}, []],
        text_disclosure_role_name_2: this.getSignFieldAllowedFor('buyers', 1),
        date_disclosure_2: [{value: '', disabled: true}, []],
        text_disclosure_firm: [{value: null, disabled: this.isDisabled}, []],
        text_disclosure_firm_lic: [{value: '', disabled: true}, []],
        text_disclosure_agent_buyer: this.getSignFieldAllowedFor('agentBuyers', 0),
        text_disclosure_agent_buyer_lic: [{value: '', disabled: true}, []],
        date_disclosure_3: [{value: '', disabled: true}, []],
      }),
      page_2: this.fb.group({
        text_confirm_seller_firm_name: [{value: '', disabled: true}, []],
        text_confirm_seller_firm_lic: [{value: '', disabled: true}, []],
        check_confirm_seller: [{value: null, disabled: this.isDisabled}, []],
        check_confirm_1_dual_agent: [{value: null, disabled: this.isDisabled}, []],
        text_confirm_seller_agent_firm_name: [{value: '', disabled: true}, []],
        text_confirm_seller_agent_firm_lic: [{value: '', disabled: true}, []],
        check_confirm_seller_agent: [{value: null, disabled: this.isDisabled}, []],
        check_confirm_2_dual_agent: [{value: null, disabled: this.isDisabled}, []],
        text_confirm_buyer_firm_name: [{value: '', disabled: true}, []],
        text_confirm_buyer_firm_lic: [{value: '', disabled: true}, []],
        check_confirm_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_confirm_3_dual_agent: [{value: null, disabled: this.isDisabled}, []],
        text_confirm_buyer_agent_firm_name: [{value: '', disabled: true}, []],
        text_confirm_buyer_agent_firm_lic: [{value: '', disabled: true}, []],
        check_confirm_buyer_agent: [{value: 'null', disabled: this.isDisabled}, []],
        check_confirm_4_dual_agent: [{value: 'null', disabled: this.isDisabled}, []],
      }),
      page_3: this.fb.group({
        text_acknowledge_seller_1: this.getSignFieldAllowedFor('sellers', 0),
        date_acknowledge_seller_1: [{value: '', disabled: true}, []],
        text_acknowledge_seller_2: this.getSignFieldAllowedFor('sellers', 1),
        date_acknowledge_seller_2: [{value: '', disabled: true}, []],
        text_acknowledge_buyer_1: this.getSignFieldAllowedFor('buyers', 0),
        date_acknowledge_buyer_1: [{value: '', disabled: true}, []],
        text_acknowledge_buyer_2: this.getSignFieldAllowedFor('buyers', 1),
        date_acknowledge_buyer_2: [{value: '', disabled: true}, []],
        text_acknowledge_buyer_agent_firm: [{value: '', disabled: true}, []],
        text_acknowledge_buyer_agent_firm_lic: [{value: '', disabled: true}, []],
        // date_acknowledge_buyer_agent_firm_date: [{value: '', disabled: true}, []],
        text_acknowledge_buyer_agent: this.getSignFieldAllowedFor('agentBuyers', 0),
        text_acknowledge_buyer_agent_lic: [{value: '', disabled: true}, []],
        date_acknowledge_buyer_agent_date: [{value: '', disabled: true}, []],
        text_acknowledge_seller_agent_firm: [{value: '', disabled: true}, []],
        text_acknowledge_seller_agent_firm_lic: [{value: '', disabled: true}, []],
        // date_acknowledge_seller_agent_firm_date: this.getSignFieldAllowedFor('agentSellers', 0),
        text_acknowledge_seller_agent: this.getSignFieldAllowedFor('agentSellers', 0),
        text_acknowledge_seller_agent_lic: [{value: '', disabled: true}, []],
        date_acknowledge_seller_agent_date: [{value: '', disabled: true}, []],
      }),
      page_4: this.fb.group({
        text_property_address: [{value: '', disabled: true}, []],
        text_buyer_tenant_1: this.getSignFieldAllowedFor('buyers', 0),
        date_buyer_tenant_1: [{value: '', disabled: true}, []],
        text_buyer_tenant_2: this.getSignFieldAllowedFor('buyers', 1),
        date_buyer_tenant_2: [{value: '', disabled: true}, []],
        text_seller_landlord_1: this.getSignFieldAllowedFor('sellers', 0),
        date_seller_landlord_1: [{value: '', disabled: true}, []],
        text_seller_landlord_2: this.getSignFieldAllowedFor('sellers', 1),
        date_seller_landlord_2: [{value: '', disabled: true}, []],
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
        text_offer_price_digits: [{value: null, disabled: this.isDisabled}, []],
        // # Close of Escrow = 51d
        check_escrow_date: [{value: true, disabled: this.isDisabled}, []],
        check_escrow_days: [{value: null, disabled: this.isDisabled}, []],
        date_escrow_date: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_days: [{value: '', disabled: this.isDisabled}, []],
        check_agency_disclosure: [{value: null, disabled: this.isDisabled}, []],
        text_agency_broker_seller_firm: [{value: '', disabled: true}, []],
        text_agency_broker_seller_firm_lic: [{value: '', disabled: true}, []],
        check_agency_broker_seller: [{value: null, disabled: this.isDisabled}, []],
        check_agency_broker_1_dual_agent: [{value: null, disabled: this.isDisabled}, []],
        text_agency_broker_seller_agent: [{value: '', disabled: true}, []],
        text_agency_broker_seller_agent_lic: [{value: '', disabled: true}, []],
        check_agency_broker_seller_agent: [{value: null, disabled: this.isDisabled}, []],
        check_agency_broker_2_dual_agent: [{value: null, disabled: this.isDisabled}, []],
        text_agency_broker_buyer_firm: [{value: '', disabled: true}, []],
        text_agency_broker_buyer_firm_lic: [{value: '', disabled: true}, []],
        check_agency_broker_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_agency_broker_3_dual_agent: [{value: null, disabled: this.isDisabled}, []],
        text_agency_broker_buyer_agent: [{value: '', disabled: true}, []],
        text_agency_broker_buyer_agent_lic: [{value: '', disabled: true}, []],
        check_agency_broker_buyer_agent: [{value: null, disabled: this.isDisabled}, []],
        check_agency_broker_4_dual_agent: [{value: null, disabled: this.isDisabled}, []],
        check_agency_competing_buyers_and_sellers: [{value: null, disabled: this.isDisabled}, []],
        // # Deposit = 53a
        text_finance_terms_amount: [{value: null, disabled: this.isDisabled}, []],
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
        check_finance_loan_type_fha: [{value: null, disabled: this.isDisabled}, {updateOn: 'change'}],
        check_finance_loan_type_va: [{value: null, disabled: this.isDisabled}, {updateOn: 'change'}],
        check_finance_loan_type_seller: [{value: null, disabled: this.isDisabled}],
        check_finance_loan_type_assumed: [{value: null, disabled: this.isDisabled}],
        check_finance_loan_type_other: [{value: null, disabled: this.isDisabled}],
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
        text_finance_first_loan_amount: [{value: null, disabled: this.isDisabled}, []],
        text_finance_second_loan_amount: [{value: null, disabled: this.isDisabled}, []],
        // # Loan Amount = loan1 + loan2 (3d1,3d2)
        text_finance_additional_terms: [{value: null, disabled: this.isDisabled}, []],
        // # Down Payment = formula = price - (initial deposits + all loans (3a…3d))
        text_finance_down_payment_balance: [{value: null, disabled: true}, []],
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
        check_sale_of_buyers_property: [{value: null, disabled: this.isDisabled}, {updateOn: 'change'}],
        check_addenda_addendum: [{value: null, disabled: this.isDisabled}, {updateOn: 'change'}],
        check_addenda_back_up_offer: [{value: null, disabled: this.isDisabled}],
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
        check_allocation_report_first_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_first_seller: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_environmental: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_other: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_other: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_prepared_by_first: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_second_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_second_seller: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_following_first: [{value: null, disabled: this.isDisabled}, []],
        text_allocation_report_prepared_by_second: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_third_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_allocation_report_third_seller: [{value: null, disabled: this.isDisabled}, []],
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
        check_pay_government_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_pay_government_seller: [{value: null, disabled: this.isDisabled}, []],
        check_pay_government_coe_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_pay_government_coe_seller: [{value: null, disabled: this.isDisabled}, []],
        check_escrow_pay_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_escrow_pay_seller: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_pay_amount: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_holder: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_payment_days: [{value: null, disabled: this.isDisabled}, []],
        check_escrow_pay_insurance_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_escrow_pay_insurance_seller: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_paragraph_13: [{value: null, disabled: this.isDisabled}, []],
        text_escrow_owner_title_issued_by: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_country_tax_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_country_tax_seller: [{value: null, disabled: this.isDisabled}, []],
        text_other_costs_country_tax_amount: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_city_tax_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_city_tax_seller: [{value: null, disabled: this.isDisabled}, []],
        text_other_costs_country_city_amount: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_hometown_tax_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_hometown_tax_seller: [{value: null, disabled: this.isDisabled}, []],
        text_other_costs_country_hometown_amount: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_hao_fee_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_hao_fee_seller: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_private_fee_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_private_fee_seller: [{value: null, disabled: this.isDisabled}, []],
        text_other_costs_private_fee_amount: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_shall_pay_first_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_shall_pay_first_seller: [{value: null, disabled: this.isDisabled}, []],
        text_other_costs_shall_pay_amount_first: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_shall_pay_second_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_shall_pay_second_seller: [{value: null, disabled: this.isDisabled}, []],
        text_other_costs_shall_pay_amount_second: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_shall_pay_cost_buyer: [{value: null, disabled: this.isDisabled}, []],
        check_other_costs_shall_pay_cost_seller: [{value: null, disabled: this.isDisabled}, []],
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
        // optional
        text_first_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_first_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_first_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_first_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
        text_second_buyer_initials_first: this.getSignFieldAllowedFor('buyers', 0),
        text_second_buyer_initials_second: this.getSignFieldAllowedFor('buyers', 1),
        text_second_seller_initials_first: this.getSignFieldAllowedFor('sellers', 0),
        text_second_seller_initials_second: this.getSignFieldAllowedFor('sellers', 1),
        // end of optional
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
        date_other_buyer_first: [{value: '', disabled: true}, []],
        text_other_buyer_print_name_first: [{value: null, disabled: this.isDisabled}, []],
        date_other_buyer_second: [{value: '', disabled: true}, []],
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
        check_one_or_more_seller: [{value: null, disabled: true}, []],
        date_one_or_more_seller: [{value: null, disabled: true}, []],
        date_seller_first: [{value: '', disabled: true}, []],
        text_seller_first: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_print_name_first: [{value: null, disabled: this.isDisabled}, []],
        date_seller_second: [{value: '', disabled: true}, []],
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
        date_buyers_brokerage_firm_date_first: [{value: '', disabled: true}, []],
        text_buyers_brokerage_firm_by_second: this.getSignFieldAllowedFor('agentBuyers', 1),
        text_buyers_brokerage_firm_lic_by_second: [{value: '', disabled: true}, []],
        date_buyers_brokerage_firm_date_second: [{value: '', disabled: true}, []],
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
        date_seller_brokerage_firm_date_first: [{value: '', disabled: true}, []],
        text_seller_brokerage_firm_by_second: this.getSignFieldAllowedFor('agentSellers', 1),
        text_seller_brokerage_firm_lic_by_second: [{value: '', disabled: true}, []],
        date_seller_brokerage_firm_date_second: [{value: '', disabled: true}, []],
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
        // reject offer signs?
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
        date_privacy_act_advisory_first: [{value: '', disabled: true}, []],
        text_privacy_act_advisory_second: this.getSignFieldAllowedFor('buyers', 1),
        date_privacy_act_advisory_second: [{value: '', disabled: true}, []],
      }),
      page_17: this.fb.group({
        check_agreement_residential: [{value: null, disabled: this.isDisabled}, []],
        check_agreement_other: [{value: null, disabled: this.isDisabled}, []],
        text_agreement_name: [{value: null, disabled: this.isDisabled}, []],
        text_agreement_address: [{value: null, disabled: this.isDisabled}, []],
        text_sign_buyer: [{value: null, disabled: true}, []],
        text_sign_seller: [{value: null, disabled: true}, []],
        text_property_value: [{value: null, disabled: this.isDisabled}, []],
        date_buyer_first_sign: [{value: null, disabled: true}, []],
        text_buyer_first_sign: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_second_sign: this.getSignFieldAllowedFor('buyers', 1),
        date_seller_first_sign: [{value: null, disabled: true}, []],
        text_seller_first_sign: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_second_sign: this.getSignFieldAllowedFor('sellers', 1),

        text_buyer_broker_firm_name: [{value: null, disabled: true}, []],
        text_buyer_broker_firm_license: [{value: null, disabled: true}, []],
        text_buyer_broker_name: [{value: null, disabled: true}, []],
        text_buyer_broker_license: [{value: null, disabled: true}, []],
        date_buyer_broker_license: [{value: null, disabled: true}, []],
        text_buyer_broker_address: [{value: null, disabled: true}, []],
        text_buyer_broker_city: [{value: null, disabled: true}, []],
        text_buyer_broker_state: [{value: null, disabled: true}, []],
        text_buyer_broker_zip: [{value: null, disabled: true}, []],
        text_buyer_broker_phone: [{value: null, disabled: true}, []],
        text_buyer_broker_fax: [{value: null, disabled: true}, []],
        text_buyer_broker_email: [{value: null, disabled: true}, []],

        text_seller_broker_firm_name: [{value: null, disabled: true}, []],
        text_seller_broker_firm_license: [{value: null, disabled: true}, []],
        text_seller_broker_name: [{value: null, disabled: true}, []],
        text_seller_broker_license: [{value: null, disabled: true}, []],
        date_seller_broker_license: [{value: null, disabled: true}, []],
        text_seller_broker_address: [{value: null, disabled: true}, []],
        text_seller_broker_city: [{value: null, disabled: true}, []],
        text_seller_broker_state: [{value: null, disabled: true}, []],
        text_seller_broker_zip: [{value: null, disabled: true}, []],
        text_seller_broker_phone: [{value: null, disabled: true}, []],
        text_seller_broker_fax: [{value: null, disabled: true}, []],
        text_seller_broker_email: [{value: null, disabled: true}, []],
      }),
      page_18: this.fb.group({
        check_agreement_purchase: [{value: '', disabled: this.isDisabled}, []],
        text_agreement_name: [{value: '', disabled: this.isDisabled}, []],
        date_agreement_date: [{value: '', disabled: true}, []],
        text_seller_property: [{value: '', disabled: true}, []],
        text_buyer_sign: [{value: '', disabled: true}, []],
        text_seller_sign: [{value: '', disabled: true}, []],
        text_buyer_property: [{value: '', disabled: this.isDisabled}, []],
        check_describe_other: [{value: '', disabled: this.isDisabled}, []],
        text_describe_other: [{value: '', disabled: this.isDisabled}, []],
        text_after_close_escrow_days: [{value: '', disabled: this.isDisabled}, []],
        check_property_not_escrow: [{value: '', disabled: this.isDisabled}, []],
        check_listed_for_sale: [{value: '', disabled: this.isDisabled}, []],
        check_not_listed_for_sale: [{value: '', disabled: this.isDisabled}, []],
        text_broker_mls_name: [{value: '', disabled: this.isDisabled}, []],
        text_broker_mls_number: [{value: '', disabled: this.isDisabled}, []],
        text_days_after_acceptance: [{value: '', disabled: this.isDisabled}, []],
        check_property_in_escrow: [{value: '', disabled: this.isDisabled}, []],
        date_property_escrow_date: [{value: '', disabled: this.isDisabled}, []],
        text_escrow_holder_name: [{value: '', disabled: this.isDisabled}, []],
        text_escrow_number: [{value: '', disabled: this.isDisabled}, []],
        text_cancel_contract_days: [{value: '', disabled: this.isDisabled}, []],
        check_seller_can_cancel: [{value: '', disabled: this.isDisabled}, []],
        check_day_after_deliver: [{value: '', disabled: this.isDisabled}, []],
        check_days_after_deliver: [{value: '', disabled: this.isDisabled}, []],
        text_days_after_delivery: [{value: '', disabled: this.isDisabled}, []],
        check_delayed_right: [{value: '', disabled: this.isDisabled}, []],
        text_days_not_invoke_provisions: [{value: '', disabled: this.isDisabled}, []],
        check_days_not_invoke_provisions: [{value: '', disabled: this.isDisabled}, []],
        date_buyer_first_sign_copy: [{value: '', disabled: true}, []],
        text_buyer_first_sign_copy: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_second_sign_copy: this.getSignFieldAllowedFor('buyers', 1),
        date_seller_first_sign_copy: [{value: '', disabled: true}, []],
        text_seller_first_sign_copy: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_second_sign_copy: this.getSignFieldAllowedFor('sellers', 1),
        text_seller_first_sign_notice: [{value: '', disabled: true}, []],
        date_seller_first_sign_notice: [{value: '', disabled: true}, []],
        text_seller_second_sign_notice: [{value: '', disabled: true}, []],
        date_seller_second_sign_notice: [{value: '', disabled: true}, []],
        text_seller_first_initials: [{value: '', disabled: true}, []],
        text_seller_second_initials: [{value: '', disabled: true}, []],
        date_signed_notice_date: [{value: '', disabled: true}, []],
        text_signed_notice_time: [{value: '', disabled: true}, []],
        radio_signed_notice_ampm: [{value: '', disabled: true}, []],
      }),
      page_19: this.fb.group({
        text_addendum_number: [{value: '', disabled: true}, []],
        check_terms_for_agreement: [{value: '', disabled: this.isDisabled}, []],
        check_terms_for_residential_lease: [{value: '', disabled: this.isDisabled}, []],
        check_terms_for_tds: [{value: '', disabled: this.isDisabled}, []],
        check_terms_for_other: [{value: '', disabled: this.isDisabled}, []],
        text_terms_for_other: [{value: '', disabled: this.isDisabled}, []],
        text_property_name: [{value: '', disabled: true}, []],
        text_referred_to_buyer: [{value: '', disabled: true}, []],
        text_referred_to_seller: [{value: '', disabled: true}, []],
        text_terms_and_conditions: [{value: '', disabled: this.isDisabled}, []],
        date_buyer_first_sign: [{value: '', disabled: true}, []],
        text_buyer_first_sign: this.getSignFieldAllowedFor('buyers', 0),
        text_buyer_second_sign: this.getSignFieldAllowedFor('buyers', 1),
        date_seller_first_sign: [{value: '', disabled: true}, []],
        text_seller_first_sign: this.getSignFieldAllowedFor('sellers', 0),
        text_seller_second_sign: this.getSignFieldAllowedFor('sellers', 1),
      }),
    }, {updateOn: 'blur'});
  }

  ngOnInit() {
    this.offerId = +this.route.snapshot.params.id;
    this.offer = this.route.snapshot.data.offer;
    this.user = this.authService.currentUser;

    this.isCountered = !![...this.offer.completedDocuments, ...this.offer.pendingDocuments]
      .find((item) => item.documentType === GeneratedDocumentType.CounterOffer);

    this.isSignMode = this.router.url.includes('sign');

    // || !this.offer.allowEdit
    this.isDisabled = this.offer.userRole !== 'agent_buyer' || this.isSignMode;

    if (this.offer.isSigned) {
      this.snackbar.open('Offer is already signed');
    }

    this.okButtonText = this.isSignMode && this.offer.allowSign && !this.offer.isSigned ? 'Finish' : 'Continue';

    this.documentForm = this.formGroupPage;

    this.subscribeToFormChanges();
  }

  ngAfterViewInit() {
    this.getOfferAgreement();

    this.getAdditionalCount();

    this.setPageBreakers();
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
          this.resetAgreement();
          this.getOfferAgreement();
        }
        if (data.requestToSave) {
          this.openSaveOfferDialog(data.changedOfferModel);
        }
      });
  }

  moveToNextSignField(signRes?) {
    const signatures = this.signatures.toArray().filter(el => el.isActiveSignRow);

    if (!this.offer.isSigned) {
      if (signatures.length) {
        if (signRes && Number(signRes.id) && signatures[signRes.id + 1]) {
          for (let i = signRes.id + 1; i < signatures.length; i++) {
            if (!signatures[i].signatureControl.value) {
              signatures[i].scrollToButton();
              return true;
            }
          }
        } else {
          for (const sd of signatures) {
            if (!sd.signatureControl.value && !sd.optional) {
              sd.scrollToButton();
              return true;
            }
          }
        }
      }

      this.openFinishingDialog();
      return false;
    }
  }

  updateDownPaymentAmount() {
    const price = +this.documentForm.get('page_5.text_offer_price_digits').value || 0;
    const initialDeposits = +this.documentForm.get('page_5.text_finance_terms_amount').value || 0;
    const increasedDeposits = +this.documentForm.get('page_5.text_finance_increased_deposit_amount').value || 0;
    const loans = +(this.documentForm.get('page_5.text_finance_first_loan_amount').value || 0) +
      +(this.documentForm.get('page_5.text_finance_second_loan_amount').value || 0);

    this.documentForm.get('page_5.text_finance_down_payment_balance')
      .patchValue((price - (initialDeposits + increasedDeposits + loans)).toFixed(2));
  }

  switchDaysAndDate(checked: boolean, value: string, daysControlName: string, dateControlName: string, emit = true) {
    switch (value) {
      case 'date':
        this.documentForm.get('page_5.check_escrow_days').patchValue(!checked, {emitEvent: emit});
        this.setRelatedFields(checked ? daysControlName : dateControlName, checked ? dateControlName : daysControlName, emit);
        break;
      case 'days':
        this.documentForm.get('page_5.check_escrow_date').patchValue(!checked, {emitEvent: emit});
        this.setRelatedFields(checked ? daysControlName : dateControlName, checked ? dateControlName : daysControlName, emit);
        break;
    }
  }

  additionalListChanges(pageId: string) {
    switch (pageId) {
      case 'FHA/VA':
        this.additionalList[pageId] =
          this.documentForm.get('page_5.check_finance_loan_type_fha').value ||
          this.documentForm.get('page_5.check_finance_loan_type_va').value;
        break;
      case 'CONTINGENCY':
        this.additionalList[pageId] = this.documentForm.get('page_6.check_sale_of_buyers_property').value;
        break;
      case 'ADDENDA':
        this.additionalList[pageId] =
          this.documentForm.get('page_6.check_addenda_addendum').value;
        break;
    }

    this.getAdditionalCount();
    this.setPageBreakers();
  }

  continue() {
    if (this.isSignMode) {
      const isSigningComplete =
        this.signatures.toArray()
          .filter(el => el.isActiveSignRow && !el.optional)
          .every((el) => !!el.signatureControl.value) || this.offer.isSigned;

      if (isSigningComplete) {
        if (this.offer.allowSign) {
          this.openFinishingDialog();
        } else {
          this.closeOffer();
        }
      } else {
        this.snackbar.open('Please, fill all sign fields');
        this.moveToNextSignField();
      }
    } else {
      this.form.nativeElement.blur();
      this.documentForm.markAllAsTouched();

      if (this.scrollToFirstInvalidField()) {
        this.snackbar.open('Please, fill all mandatory fields');
      } else {
        this.offerService.updateOfferProgress({progress: 3}, this.offerId)
          .pipe(takeUntil(this.onDestroyed$))
          .subscribe(() => {
            this.router.navigate([`portal/purchase-agreements/${this.offerId}/step-three`]);
          });
      }
    }
  }

  closeOffer() {
    this.form.nativeElement.blur();
    this.router.navigateByUrl(`/portal/purchase-agreements/${this.offerId}/details`);
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  denyOffer() {
    this.isLoading = true;

    this.offerService.rejectOffer(this.offer.id).pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(() => {
      this.isLoading = false;
      this.snackbar.open(`Offer is denied.`);

      this.closeOffer();
    });
  }

  createCounterOffer(type) {
    this.isLoading = true;

    this.counterOfferService.createCounterOffer({offer: this.offer.id, offerType: type})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: CounterOffer) => {
        this.isLoading = false;
        this.router.navigateByUrl(`portal/offer/${this.offer.id}/counter-offers/${data.id}/${CounterOfferType[type]}`);
      });
  }

  private getAdditionalCount() {
    let firstPageCount = this.AGREEMENT_PAGE_NUM + 1;
    this.additionalPageCount = [...Object.values(this.additionalList).map((page) => page ? firstPageCount++ : null)];
  }

  private getOfferAgreement() {
    this.isLoading = true;

    this.offerService.getOfferDocument(this.offerId)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((model) => {
        this.patchForm(model);

        this.getAllFieldsCount(model);
        this.updatePageProgress(model, 0);

        this.updateAdditionalPages();

        this.cdr.detectChanges();

        this.checkSignAccess();

        this.initSwitchDaysAndDate();

        this.isLoading = false;
      });
  }

  private updateAdditionalPages() {
    Object.entries(this.additionalList).map(page => this.additionalListChanges(page[0]));
  }

  private initSwitchDaysAndDate() {
    if (this.documentForm.get('page_5.text_escrow_days').value) {
      this.switchDaysAndDate(
        true,
        'days',
        'page_5.text_escrow_days',
        'page_5.date_escrow_date',
        false
      );
    }
  }

  private checkSignAccess() {
    if (this.offer.userRole === 'agent_buyer' && this.isSignMode
      && (this.documentForm.invalid || !this.offer.allowSign || this.offer.isSigned)) {
      this.router.navigateByUrl(`/portal/purchase-agreements/${this.offerId}/step-two`);
    } else if (this.offer.userRole !== 'agent_buyer' && !this.isSignMode) {
      this.router.navigateByUrl(`/portal/purchase-agreements/${this.offerId}/sign`);
    } else if (this.isSignMode && this.offer.allowSign) {
      this.activateSignButtons();
    }
  }

  // TODO incapsulate sign button rendering
  private activateSignButtons() {
    let index = 0;
    this.signatures.toArray().forEach((sd: SignatureDirective) => {
      if (sd.signatureControl.enabled && !sd.signatureControl.value) {
        sd.renderSignButton();
        sd.signId = index;
        index++;
      }
    });

    this.moveToNextSignField();
  }

  private setRelatedFields(enableControl: string, disableControl: string, emit: boolean) {
    this.documentForm.get(enableControl).enable({emitEvent: false});
    this.documentForm.get(enableControl).markAsDirty();

    this.documentForm.get(disableControl).clearValidators();
    this.documentForm.get(disableControl).disable({emitEvent: false});
    this.documentForm.get(disableControl).patchValue('', {emitEvent: emit});
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
    Object.entries(model).forEach(([page, pageValue]) => {
      Object.entries(pageValue).forEach(([field, fieldValue]) => {
        const control = this.documentForm.get(`${_.snakeCase(page)}.${_.snakeCase(field)}`);
        if (control) {
          if (this.offerService.isDateISOFormat(fieldValue)) {
            fieldValue = this.offerService.convertStringToDate(fieldValue);
          }

          control.patchValue(fieldValue, {emitEvent: false, onlySelf: true});
        }
      });

      this.documentForm.get(`${_.snakeCase(page)}`).updateValueAndValidity();
    });
  }

  private getAllFieldsCount(model) {
    this.allFieldsCount = 0;

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
            if (this.offer.anyUserSigned && this.offer.userRole === 'agent_buyer') {
              this.resetAgreement();
            }

            this.saveDocumentField(Object.keys(group.getRawValue())[controlIndex], controlValue, groupIndex);
          });
      });
    });
  }

  private saveDocumentField(controlName: string, controlValue: any, groupIndex: number) {
    if (controlValue === '') {
      controlValue = null;
    } else if (this.offerService.isDateFormat(controlValue) || controlValue instanceof Date) {
      controlValue = this.datePipe.transform(controlValue, 'yyyy-MM-dd');
    } else if (+controlValue) {
      controlValue = String(controlValue).replace(',', '');
    }

    this.offerService.updateOfferDocumentField({offerId: this.offerId, page: groupIndex + 1}, {[controlName]: controlValue})
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.updatePageProgress(this.documentForm.getRawValue(), this.currentPage);

        if (_.includes(this.downPaymentAmountPredicates, controlName)) {
          this.updateDownPaymentAmount();
        }
      });
  }

  private resetAgreement() {
    this.signatures.toArray().forEach((signature) => {
      if (signature.isActiveSignRow) {
        signature.resetData();
      }
    });

    this.offer.anyUserSigned = false;
    this.offer.status = AgreementStatus.Started;
    this.offer.isSigned = false;
    this.isSignMode = false;

    this.snackbar.open('The document was changed. Please, resign.');
  }

  private finalSignAgreement() {
    this.offerService.signOffer(this.offerId)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.offer.isSigned = true;
        this.snackbar.open('Offer is signed now');
        if (this.counterOfferService.currentCO && this.profileService.previousRouteUrl
          .includes(`/portal/offer/${this.offerId}/counter-offers/${this.counterOfferService.currentCO.id}/`)) {
          this.router.navigateByUrl(this.profileService.previousRouteUrl);
        } else {
          this.router.navigateByUrl(`/portal/purchase-agreements/${this.offerId}/details`);
          // if (this.offer.progress >= 3) {
          //   this.router.navigateByUrl(`/portal/purchase-agreements/${this.offerId}/details`);
          // } else {
          //   this.router.navigateByUrl(`/portal/purchase-agreements/${this.offerId}/step-three`);
          // }
        }
      }, () => {
        this.offer.isSigned = false;
        this.snackbar.open('Cannot sign the offer');
      });
  }

  private setPageBreakers() {
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
                this.resetAgreement();
                this.getOfferAgreement();
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

  private getSignFieldAllowedFor(role: string, index: number) {
    return [{
      value: '',
      disabled: this.isSignMode
        ? (this.offer[role][index] ? this.offer[role][index].email !== this.user.email : true)
        : true,
    }, []];
  }

  private openFinishingDialog() {
    const dialogRef = this.dialog.open(FinishSigningDialogComponent, {width: '600px'});

    dialogRef.afterClosed()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((isFinished: boolean) => {
        if (isFinished) {
          this.finalSignAgreement();
        }
      });
  }
}
