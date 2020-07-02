import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  constructor(private offerService: OfferService) { }

  ngOnInit() {
    this.offerService.offerProgress = 4;
  }

}
