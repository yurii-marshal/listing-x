import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneratedDocument } from '../../../core-modules/models/document';
import { Transaction } from '../../../core-modules/models/transaction';
import { TransactionService } from '../../portal/services/transaction.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-spq-signature',
  templateUrl: './spq-signature.component.html',
  styleUrls: ['./spq-signature.component.scss']
})
export class SpqSignatureComponent implements OnInit {
  doc: GeneratedDocument;
  transaction: Transaction;

  progress: number = 0;

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    const docId: number = +this.route.snapshot.params.id;
    this.transactionService.loadSignDocument(docId).pipe(
      tap((doc) => this.doc = doc),
      switchMap((doc) => this.transactionService.loadOne(doc.transaction))
    ).subscribe((transaction) => this.transaction = transaction);
  }
}
