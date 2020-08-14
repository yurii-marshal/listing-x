import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseCounterOfferAbstract } from '../../base-counter-offer.abstract';
import { Router } from '@angular/router';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-buyer-co-agreement',
  templateUrl: './buyer-co-agreement.component.html',
  styleUrls: ['./../../counter-offer.scss', './buyer-co-agreement.component.scss']
})
export class BuyerCOAgreementComponent extends BaseCounterOfferAbstract<null> implements OnInit {
  @ViewChildren('form') form;
  isSideBarOpen: boolean;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;

  documentForm: FormGroup;

  state = 'counter-offer';

  constructor(
    private fb: FormBuilder,
    protected router: Router,
    protected offerService: OfferService,
  ) {
    super(router, offerService);
  }

  ngOnInit() {
    this.documentForm = this.fb.group({});
  }

  continue() {
    this.documentForm.markAllAsTouched();
  }

}
