import { Component, Input, OnInit } from '@angular/core';
import { CounterOffer } from 'src/app/core-modules/models/counter-offer';

@Component({
  selector: 'app-offer-information',
  templateUrl: './offer-information.component.html',
  styleUrls: ['./offer-information.component.scss']
})
export class OfferInformationComponent implements OnInit {
  @Input() counterOffer: CounterOffer;
  @Input() isSideBarOpen: boolean;

  constructor() { }

  ngOnInit() {
  }

}
