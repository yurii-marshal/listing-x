import {Component, Input, OnInit} from '@angular/core';
import {Transaction} from '../../../../core-modules/models/transaction';

@Component({
  selector: 'app-contract-document',
  templateUrl: './contract-document.component.html',
  styleUrls: ['./contract-document.component.scss']
})
export class ContractDocumentComponent implements OnInit {
  @Input() transaction: Transaction;

  constructor() { }

  ngOnInit() {
  }

}
