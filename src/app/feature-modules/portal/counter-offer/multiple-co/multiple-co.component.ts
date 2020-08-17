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
  private isDisabled: boolean;

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
    this.isDisabled = !!super.counterOffer;

    this.documentForm = this.fb.group({
      text_counter_offer_number: [{value: null, disabled: this.isDisabled}, []],
      date_seller_counter_date: [{value: null, disabled: this.isDisabled}, []],
      check_counter_type_other: [{value: null, disabled: this.isDisabled}, []],
      text_offer_type_other: [{value: null, disabled: this.isDisabled}, []],
      date_offer_dated: [{value: null, disabled: this.isDisabled}, []],
      text_property_address: [{value: null, disabled: this.isDisabled}, []],
      text_between_buyer: [{value: null, disabled: this.isDisabled}, []],
      text_between_seller: [{value: null, disabled: this.isDisabled}, []],
      text_other_therms: [{value: null, disabled: this.isDisabled}, []],
      check_attached_addendum_first: [{value: null, disabled: this.isDisabled}, []],
      text_addendum_number_first: [{value: null, disabled: this.isDisabled}, []],
      check_attached_addendum_second: [{value: null, disabled: this.isDisabled}, []],
      text_addendum_number_second: [{value: null, disabled: this.isDisabled}, []],
      check_attached_addendum_third: [{value: null, disabled: this.isDisabled}, []],
      text_addendum_number_third: [{value: null, disabled: this.isDisabled}, []],
      time_counter_offer_expiration_time: [{value: null, disabled: this.isDisabled}, []],
      radio_expiration_am_pm: [{value: 'AM', disabled: this.isDisabled}, []],
      date_expiration_date: [{value: null, disabled: this.isDisabled}, []],
      text_seller_alternative_name: [{value: null, disabled: this.isDisabled}, []],
      text_seller_name_first: [{value: null, disabled: this.isDisabled}, []],
      date_seller_signature_first: [{value: this.getSignFieldAllowedFor('sellers', 0), disabled: this.isDisabled}, []],
      text_seller_name_second: [{value: null, disabled: this.isDisabled}, []],
      date_seller_signature_second: [{value: this.getSignFieldAllowedFor('sellers', 1), disabled: this.isDisabled}, []],
      time_deposit_revoke_time: [{value: null, disabled: this.isDisabled}, []],
      radio_deposit_revoke_am_pm: [{value: 'AM', disabled: this.isDisabled}, []],
      date_deposit_revoke_expiration_date: [{value: null, disabled: this.isDisabled}, []],
      text_buyer_alternative_name: [{value: null, disabled: this.isDisabled}, []],
      check_receive_copy: [{value: null, disabled: this.isDisabled}, []],
      text_receive_copy: [{value: null, disabled: this.isDisabled}, []],
      text_buyer_name_first: [{value: null, disabled: this.isDisabled}, []],
      date_buyer_signature_first: [{value: this.getSignFieldAllowedFor('buyers', 0), disabled: this.isDisabled}, []],
      time_buyer_signature_time_first: [{value: this.getSignFieldAllowedFor('buyers', 0), disabled: this.isDisabled}, []],
      radio_buyer_signature_first: [{value: 'AM', disabled: this.isDisabled}, []],
      text_buyer_name_second: [{value: null, disabled: this.isDisabled}, []],
      date_buyer_signature_second: [{value: this.getSignFieldAllowedFor('buyers', 1), disabled: this.isDisabled}, []],
      time_buyer_signature_time_second: [{value: this.getSignFieldAllowedFor('buyers', 1), disabled: this.isDisabled}, []],
      radio_buyer_signature_second: [{value: 'AM', disabled: this.isDisabled}, []],
      text_seller_signature_name_first: [{value: null, disabled: this.isDisabled}, []],
      date_seller_first_signature: [{value: this.getSignFieldAllowedFor('sellers', 0), disabled: this.isDisabled}, []],
      time_seller_signature_time_first: [{value: this.getSignFieldAllowedFor('sellers', 0), disabled: this.isDisabled}, []],
      radio_seller_signature_first: [{value: 'AM', disabled: this.isDisabled}, []],
      text_seller_signature_name_second: [{value: null, disabled: this.isDisabled}, []],
      date_seller_second_signature: [{value: this.getSignFieldAllowedFor('sellers', 1), disabled: this.isDisabled}, []],
      time_seller_signature_time_second: [{value: this.getSignFieldAllowedFor('sellers', 1), disabled: this.isDisabled}, []],
      radio_seller_signature_second: [{value: 'AM', disabled: this.isDisabled}, []],
      text_seller_initials_first: [{value: null, disabled: this.isDisabled}, []],
      text_seller_initials_second: [{value: null, disabled: this.isDisabled}, []],
      date_copy_received_date: [{value: null, disabled: this.isDisabled}, []],
      time_copy_received_time: [{value: null, disabled: this.isDisabled}, []],
      radio_copy_received_am_pm: [{value: 'AM', disabled: this.isDisabled}, []],
    });
  }

  private getSignFieldAllowedFor(role: string, index: number) {
    return null;
  }

  continue() {
    this.documentForm.markAllAsTouched();
  }

}
