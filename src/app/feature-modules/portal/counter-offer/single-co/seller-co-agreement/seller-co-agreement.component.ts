import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseCounterOfferAbstract } from '../../base-counter-offer.abstract';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { CounterOfferService } from '../../../services/counter-offer.service';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MatDialog, MatSnackBar } from '@angular/material';
import { CounterOffer } from '../../../../../core-modules/models/counter-offer';
import { AuthService } from '../../../../../core-modules/core-services/auth.service';
import { PICK_FORMATS, PickDateAdapter } from '../../../../../core-modules/adapters/date-adapter';
import { ProfileService } from '../../../../../core-modules/core-services/profile.service';

@Component({
  selector: 'app-seller-co-agreement',
  templateUrl: './seller-co-agreement.component.html',
  styleUrls: ['./../../counter-offer.scss', './seller-co-agreement.component.scss'],
  providers: [
    DatePipe,
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
  ]
})
export class SellerCOAgreementComponent extends BaseCounterOfferAbstract<CounterOffer> implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public offerService: OfferService,
    public counterOfferService: CounterOfferService,
    public snackbar: MatSnackBar,
    public datePipe: DatePipe,
    public authService: AuthService,
    public dialog: MatDialog,
    public profileService: ProfileService,
  ) {
    super(route, router, offerService, counterOfferService, snackbar, datePipe, authService, dialog, profileService);
  }

  private get formGroupPage(): FormGroup {
    return this.fb.group({
      date_seller_counter_date: [{value: null, disabled: true}, []],
      check_purchase_agreement: [{value: null, disabled: true}, []],
      check_counter_offer_buyer: [{value: null, disabled: true}, []],
      check_counter_offer_other: [{value: null, disabled: true}, []],
      text_counter_offer_number: [{value: null, disabled: true}, []],
      text_offer_type_other: [{value: null, disabled: true}, []],
      date_offer_dated: [{value: null, disabled: true}, []],
      text_property_address: [{value: null, disabled: true}, []],
      text_between_buyer: [{value: null, disabled: true}, []],
      text_between_seller: [{value: null, disabled: true}, []],
      text_other_therms: [{value: null, disabled: true}, []],
      check_attached_addendum_first: [{value: null, disabled: true}, []],
      text_addendum_number_first: [{value: null, disabled: true}, []],
      check_attached_addendum_second: [{value: null, disabled: true}, []],
      text_addendum_number_second: [{value: null, disabled: true}, []],
      check_attached_addendum_third: [{value: null, disabled: true}, []],
      text_addendum_number_third: [{value: null, disabled: true}, []],
      time_counter_offer_expiration_time: [{value: null, disabled: true}, []],
      check_expiration_am: [{value: null, disabled: true}, []],
      check_expiration_pm: [{value: null, disabled: true}, []],
      date_expiration_date: [{value: null, disabled: true}, []],
      text_seller_alternative_name: [{value: null, disabled: true}, []],
      check_seller_withdraw: [{value: null, disabled: true}, []],
      check_seller_accept: [{value: null, disabled: true}, []],
      text_seller_name_first: this.getSignFieldAllowedFor('text_seller_name_first', 'pitcherCustomers', 0),
      date_seller_signature_first: [{value: null, disabled: true}, []],
      text_seller_name_second: this.getSignFieldAllowedFor('text_seller_name_second', 'pitcherCustomers', 1),
      date_seller_signature_second: [{value: null, disabled: true}, []],
      check_receive_copy: [{value: null, disabled: true}, []],
      text_buyer_name_first: this.getSignFieldAllowedFor('text_buyer_name_first', 'catcherCustomers', 0),
      date_buyer_signature_first: [{value: null, disabled: true}, []],
      time_buyer_signature_time_first: [{value: null, disabled: true}, []],
      radio_buyer_signature_first: [{value: 'am', disabled: true}, []],
      text_buyer_name_second: this.getSignFieldAllowedFor('text_buyer_name_second', 'catcherCustomers', 1),
      date_buyer_signature_second: [{value: null, disabled: true}, []],
      time_buyer_signature_time_second: [{value: null, disabled: true}, []],
      radio_buyer_signature_second: [{value: 'am', disabled: true}, []],
      text_seller_initials_first: this.getSignFieldAllowedFor('text_seller_initials_first', 'pitcherCustomers', 0),
      text_seller_initials_second: this.getSignFieldAllowedFor('text_seller_initials_second', 'pitcherCustomers', 1),
      date_copy_received_date: [{value: null, disabled: true}, []],
      time_copy_received_time: [{value: null, disabled: true}, []],
      check_copy_received_am: [{value: null, disabled: true}, []],
      check_copy_received_pm: [{value: null, disabled: true}, []],
    }, {updateOn: 'blur'});
  }

  ngOnInit() {
    super.ngOnInit();

    this.prevFormSnapshot = this.formGroupPage;
    this.documentForm = this.formGroupPage;
  }
}
