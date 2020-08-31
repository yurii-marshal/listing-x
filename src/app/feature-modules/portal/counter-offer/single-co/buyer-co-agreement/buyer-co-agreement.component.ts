import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseCounterOfferAbstract } from '../../base-counter-offer.abstract';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { CounterOfferService } from '../../../services/counter-offer.service';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { CounterOffer } from '../../../../../core-modules/models/counter-offer';
import { AuthService } from '../../../../../core-modules/core-services/auth.service';

@Component({
  selector: 'app-buyer-co-agreement',
  templateUrl: './buyer-co-agreement.component.html',
  styleUrls: ['./../../counter-offer.scss', './buyer-co-agreement.component.scss'],
  providers: [DatePipe],
})
export class BuyerCOAgreementComponent extends BaseCounterOfferAbstract<CounterOffer> implements OnInit {

  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public offerService: OfferService,
    public counterOfferService: CounterOfferService,
    public snackbar: MatSnackBar,
    public datePipe: DatePipe,
    public authService: AuthService,
  ) {
    super(route, router, offerService, counterOfferService, snackbar, datePipe, authService);
  }

  ngOnInit() {
    super.ngOnInit();

    this.documentForm = this.fb.group({
      date_buyer_counter_date: [{value: null, disabled: true}, []],
      check_counter_offer: [{value: null, disabled: true}, []],
      check_counter_offer_multiple: [{value: null, disabled: true}, []],
      check_counter_offer_other: [{value: null, disabled: true}, []],
      text_offer_type_other: [{value: null, disabled: true}, []],
      text_counter_offer_number: [{value: null, disabled: true}, []],
      text_multiple_counter_offer_number: [{value: null, disabled: true}, []],
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
      radio_expiration_am_pm: [{value: 'am', disabled: true}, []],
      date_expiration_date: [{value: null, disabled: true}, []],
      text_buyer_alternative_name: [{value: null, disabled: true}, []],
      check_buyer_withdraw: [{value: null, disabled: true}, []],
      text_buyer_name_first: this.getSignFieldAllowedFor('text_buyer_name_first', 'pitcherCustomers', 0),
      date_buyer_signature_first: [{value: null, disabled: true}, []],
      text_buyer_name_second: this.getSignFieldAllowedFor('text_buyer_name_second', 'pitcherCustomers', 1),
      date_buyer_signature_second: [{value: null, disabled: true}, []],
      check_receive_copy: [{value: null, disabled: true}, []],
      text_seller_signature_name_first: this.getSignFieldAllowedFor('text_seller_signature_name_first', 'catcherCustomers', 0),
      date_seller_first_signature: [{value: null, disabled: true}, []],
      time_seller_signature_time_first: [{value: null, disabled: true}, []],
      radio_seller_signature_first: [{value: 'am', disabled: true}, []],
      text_seller_signature_name_second: this.getSignFieldAllowedFor('text_seller_signature_name_second', 'catcherCustomers', 1),
      date_seller_second_signature: [{value: null, disabled: true}, []],
      time_seller_signature_time_second: [{value: null, disabled: true}, []],
      radio_seller_signature_second: [{value: 'am', disabled: true}, []],
      text_buyer_initials_first: this.getSignFieldAllowedFor('text_buyer_initials_first', 'pitcherCustomers', 0),
      text_buyer_initials_second: this.getSignFieldAllowedFor('text_buyer_initials_second', 'pitcherCustomers', 1),
      date_copy_received_date: [{value: null, disabled: true}, []],
      time_copy_received_time: [{value: null, disabled: true}, []],
      radio_copy_received_am_pm: [{value: 'am', disabled: true}, []],
    }, {updateOn: 'blur'});
  }
}
