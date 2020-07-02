import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  constructor(private offerService: OfferService) { }

  ngOnInit() {
    this.offerService.offerProgress = 2;
  }

}
