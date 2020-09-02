import { Component, Input, OnInit } from '@angular/core';
import { CounterOffer } from 'src/app/core-modules/models/counter-offer';
import { CounterOfferType } from '../../../core-modules/models/counter-offer-type';

@Component({
  selector: 'app-counter-offer-information',
  templateUrl: './counter-offer-information.component.html',
  styleUrls: ['./counter-offer-information.component.scss']
})
export class CounterOfferInformationComponent implements OnInit {
  @Input() counterOffer: CounterOffer;
  @Input() show: boolean;

  role: object;

  constructor() {
  }

  ngOnInit() {
    switch (this.counterOffer && this.counterOffer.offerType) {
      case CounterOfferType.buyer_counter_offer:
        this.role = {
          pitchers: 'Buyer Agent',
          catchers: 'Listing Agent',
          pitcherCustomers: 'Buyer',
          catcherCustomers: 'Seller',
        };
        break;
      default:
        this.role = {
          pitchers: 'Listing Agent',
          catchers: 'Buyer Agent',
          pitcherCustomers: 'Seller',
          catcherCustomers: 'Buyer',
        };
    }
  }

}
