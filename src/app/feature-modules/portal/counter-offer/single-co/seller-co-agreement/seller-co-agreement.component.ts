import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseCounterOfferAbstract } from '../../base-counter-offer.abstract';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { CounterOfferService } from '../../../services/counter-offer.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { CounterOffer } from '../../../../../core-modules/models/counter-offer';
import { forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-seller-co-agreement',
  templateUrl: './seller-co-agreement.component.html',
  styleUrls: ['./../../counter-offer.scss', './seller-co-agreement.component.scss'],
  providers: [DatePipe],
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
  ) {
    super(route, router, offerService, counterOfferService, snackbar, datePipe);
  }

  ngOnInit() {
    super.ngOnInit();

    this.isDisabled = false;
    // this.isDisabled = this.counterOffer.userRole !== 'agent_seller';

    this.documentForm = this.fb.group({
      date_seller_counter_date: [{value: null, disabled: true}, []],
      radio_counter_offer_type: [{value: 'purchase_agreement', disabled: this.isDisabled}, []],
      text_counter_offer_number: [{value: null, disabled: true}, []],
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
      check_seller_withdraw: [{value: null, disabled: this.isDisabled}, []],
      check_seller_accept: [{value: null, disabled: this.isDisabled}, []],
      text_seller_name_first: [{value: null, disabled: this.isDisabled}, []],
      date_seller_signature_first: this.getSignFieldAllowedFor('sellers', 0),
      text_seller_name_second: [{value: null, disabled: this.isDisabled}, []],
      date_seller_signature_second: this.getSignFieldAllowedFor('sellers', 1),
      check_receive_copy: [{value: null, disabled: this.isDisabled}, []],
      text_buyer_name_first: [{value: null, disabled: this.isDisabled}, []],
      date_buyer_signature_first: this.getSignFieldAllowedFor('buyers', 0),
      time_buyer_signature_time_first: this.getSignFieldAllowedFor('buyers', 0),
      radio_buyer_signature_first: [{value: 'AM', disabled: this.isDisabled}, []],
      text_buyer_name_second: [{value: null, disabled: this.isDisabled}, []],
      date_buyer_signature_second: this.getSignFieldAllowedFor('buyers', 1),
      time_buyer_signature_time_second: this.getSignFieldAllowedFor('buyers', 1),
      radio_buyer_signature_second: [{value: 'AM', disabled: this.isDisabled}, []],
      text_seller_initials_first: [{value: null, disabled: this.isDisabled}, []],
      text_seller_initials_second: [{value: null, disabled: this.isDisabled}, []],
      date_copy_received_date: [{value: null, disabled: this.isDisabled}, []],
      time_copy_received_time: [{value: null, disabled: this.isDisabled}, []],
      radio_copy_received_am_pm: [{value: 'AM', disabled: this.isDisabled}, []],
    }, {updateOn: 'blur'});

    if (this.id) {
      this.type = this.router.url.split('/').pop() as 'seller' | 'buyer' | 'multiple';

      forkJoin(
        this.counterOfferService.loadOne(this.id),
        this.counterOfferService.getCounterOfferDocument(this.id, this.type),
      )
        .pipe(takeUntil(this.onDestroyed$))
        .subscribe(([data, model]) => {
          this.counterOffer = data;

          this.patchForm(model, this.documentForm);
          this.getAllFieldsCount(model);
          this.disableSignedFields();
          this.moveToNextSignField(true);
        });

      this.subscribeToFormChanges();
    }
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

}
