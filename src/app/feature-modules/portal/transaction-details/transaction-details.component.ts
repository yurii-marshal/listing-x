import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { Transaction, TransactionStatus } from '../../../core-modules/models/transaction';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  transaction: Transaction;

  constructor(private route: ActivatedRoute,
              private transactionService: TransactionService) { }

  ngOnInit() {
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.loadOne(transactionId)
      .subscribe((transaction: Transaction) => this.transaction = transaction)
  }

  onDelete() {}

  getClassName(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.Started:
        return 'blue';
      case TransactionStatus.InReview:
        return 'yellow';
      case TransactionStatus.Denied:
        return 'red';
      case TransactionStatus.Accepted:
      case TransactionStatus.Completed:
        return  'green';
    }
  }
}
