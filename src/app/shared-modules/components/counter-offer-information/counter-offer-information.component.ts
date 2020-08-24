import { Component, Input, OnInit } from '@angular/core';
import { CounterOffer } from 'src/app/core-modules/models/counter-offer';

@Component({
  selector: 'app-counter-offer-information',
  templateUrl: './counter-offer-information.component.html',
  styleUrls: ['./counter-offer-information.component.scss']
})
export class CounterOfferInformationComponent implements OnInit {
  @Input() counterOffer: CounterOffer;
  @Input() isSideBarOpen: boolean;

  constructor() { }

  ngOnInit() {
  }

}
