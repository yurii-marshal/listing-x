import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Offer } from 'src/app/core-modules/models/offer';
import { User } from 'src/app/feature-modules/auth/models';

@Component({
  selector: 'app-seller-co-agreement',
  templateUrl: './seller-co-agreement.component.html',
  styleUrls: ['./../../counter-offer.scss', './seller-co-agreement.component.scss']
})
export class SellerCOAgreementComponent implements OnInit {
  @ViewChildren('form') form;
  isSideBarOpen: boolean;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;

  documentForm: FormGroup;
  offer: Offer;

  state = 'counter-offer';

  private user: User;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.documentForm = this.fb.group({
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
      check_seller_withdraw: [{value: null, disabled: true}, []],
      check_seller_accept: [{value: null, disabled: true}, []],
      text_seller_name_first: [{value: null, disabled: true}, []],
      date_seller_signature_first: [{value: this.getSignFieldAllowedFor('sellers', 0), disabled: true}, []],
      text_seller_name_second: [{value: null, disabled: true}, []],
      date_seller_signature_second: [{value: this.getSignFieldAllowedFor('sellers', 1), disabled: true}, []],
      check_receive_copy: [{value: null, disabled: true}, []],
      text_buyer_name_first: [{value: null, disabled: true}, []],
      date_buyer_signature_first: [{value: this.getSignFieldAllowedFor('buyers', 0), disabled: true}, []],
      time_buyer_signature_time_first: [{value: this.getSignFieldAllowedFor('buyers', 0), disabled: true}, []],
      radio_buyer_signature_first: [{value: 'AM', disabled: true}, []],
      text_buyer_name_second: [{value: null, disabled: true}, []],
      date_buyer_signature_second: [{value: this.getSignFieldAllowedFor('buyers', 1), disabled: true}, []],
      time_buyer_signature_time_second: [{value: this.getSignFieldAllowedFor('buyers', 1), disabled: true}, []],
      radio_buyer_signature_second: [{value: 'AM', disabled: true}, []],
      text_seller_initials_first: [{value: null, disabled: true}, []],
      text_seller_initials_second: [{value: null, disabled: true}, []],
      date_copy_received_date: [{value: null, disabled: true}, []],
      time_copy_received_time: [{value: null, disabled: true}, []],
      radio_copy_received_am_pm: [{value: 'AM', disabled: true}, []],
    });
  }

  private getSignFieldAllowedFor(role: string, index: number) {
    const value = {
      value: '',
      disabled: this.offer[role][index] ? this.offer[role][index].email !== this.user.email : true,
    };
    // const validators = this.offer[role][index] ? (this.offer[role][index].email === this.user.email ? [Validators.required] : []) : [];

    return [value, []];
  }

  continue() {
    this.documentForm.markAllAsTouched();
  }

}
