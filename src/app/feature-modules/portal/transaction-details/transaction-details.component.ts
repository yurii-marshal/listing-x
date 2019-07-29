import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OfferSummary } from '../../../core-modules/models/offer';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  offer: OfferSummary; //

  offerId: number = 43;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.offer = this.route.snapshot.data.model as OfferSummary;
  }

  onEdit() {}

  onDelete() {}
}
