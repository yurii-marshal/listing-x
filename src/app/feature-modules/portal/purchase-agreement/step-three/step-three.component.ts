import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit {

  constructor(private offerService: OfferService) { }

  ngOnInit() {
    this.offerService.offerProgress = 3;
  }

}
