import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseCounterOfferAbstract } from '../base-counter-offer.abstract';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from 'src/app/core-modules/models/offer';
import { User } from 'src/app/feature-modules/auth/models';
import { CounterOfferService } from '../../services/counter-offer.service';

@Component({
  selector: 'app-multiple-co',
  templateUrl: './multiple-co.component.html',
  styleUrls: ['./../counter-offer.scss', './multiple-co.component.scss']
})
export class MultipleCOComponent extends BaseCounterOfferAbstract<null> implements OnInit {
  @ViewChildren('form') form;
  isSideBarOpen: boolean;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;

  documentForm: FormGroup;
  offer: Offer;

  state = 'counter-offer';

  private user: User;

  constructor(
    private fb: FormBuilder,
    protected route: ActivatedRoute,
    protected router: Router,
    protected offerService: OfferService,
    protected counterOfferService: CounterOfferService,
  ) {
    super(route, router, offerService, counterOfferService);
  }

  ngOnInit() {
    this.documentForm = this.fb.group({
      text_counter_offer_number: [{value: null, disabled: true}, []],
      date_seller_counter_date: [{value: null, disabled: true}, []],
      check_counter_type_other: [{value: null, disabled: true}, []],
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
      radio_expiration_am_pm: [{value: 'AM', disabled: true}, []],
      date_expiration_date: [{value: null, disabled: true}, []],
      text_seller_alternative_name: [{value: null, disabled: true}, []],
      text_seller_name_first: [{value: null, disabled: true}, []],
      date_seller_signature_first: [{value: this.getSignFieldAllowedFor('sellers', 0), disabled: true}, []],
      text_seller_name_second: [{value: null, disabled: true}, []],
      date_seller_signature_second: [{value: this.getSignFieldAllowedFor('sellers', 1), disabled: true}, []],
      time_deposit_revoke_time: [{value: null, disabled: true}, []],
      radio_deposit_revoke_am_pm: [{value: 'AM', disabled: true}, []],
      date_deposit_revoke_expiration_date: [{value: null, disabled: true}, []],
      text_buyer_alternative_name: [{value: null, disabled: true}, []],
      check_receive_copy: [{value: null, disabled: true}, []],
      text_receive_copy: [{value: null, disabled: true}, []],
      text_buyer_name_first: [{value: null, disabled: true}, []],
      date_buyer_signature_first: [{value: this.getSignFieldAllowedFor('buyers', 0), disabled: true}, []],
      time_buyer_signature_time_first: [{value: this.getSignFieldAllowedFor('buyers', 0), disabled: true}, []],
      radio_buyer_signature_first: [{value: 'AM', disabled: true}, []],
      text_buyer_name_second: [{value: null, disabled: true}, []],
      date_buyer_signature_second: [{value: this.getSignFieldAllowedFor('buyers', 1), disabled: true}, []],
      time_buyer_signature_time_second: [{value: this.getSignFieldAllowedFor('buyers', 1), disabled: true}, []],
      radio_buyer_signature_second: [{value: 'AM', disabled: true}, []],
      text_seller_signature_name_first: [{value: null, disabled: true}, []],
      date_seller_first_signature: [{value: this.getSignFieldAllowedFor('sellers', 0), disabled: true}, []],
      time_seller_signature_time_first: [{value: this.getSignFieldAllowedFor('sellers', 0), disabled: true}, []],
      radio_seller_signature_first: [{value: 'AM', disabled: true}, []],
      text_seller_signature_name_second: [{value: null, disabled: true}, []],
      date_seller_second_signature: [{value: this.getSignFieldAllowedFor('sellers', 1), disabled: true}, []],
      time_seller_signature_time_second: [{value: this.getSignFieldAllowedFor('sellers', 1), disabled: true}, []],
      radio_seller_signature_second: [{value: 'AM', disabled: true}, []],
      text_seller_initials_first: [{value: null, disabled: true}, []],
      text_seller_initials_second: [{value: null, disabled: true}, []],
      date_copy_received_date: [{value: null, disabled: true}, []],
      time_copy_received_time: [{value: null, disabled: true}, []],
      radio_copy_received_am_pm: [{value: 'AM', disabled: true}, []],
    });
  }

  private getSignFieldAllowedFor(role: string, index: number) {
    return null;
  }

  continue() {
    this.documentForm.markAllAsTouched();
  }

}
