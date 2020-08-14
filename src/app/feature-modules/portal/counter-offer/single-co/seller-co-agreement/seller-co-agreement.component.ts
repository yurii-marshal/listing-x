import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-seller-co-agreement',
  templateUrl: './seller-co-agreement.component.html',
  styleUrls: ['./../../counter-offer.scss', './seller-co-agreement.component.scss']
})
export class SellerCOAgreementComponent implements OnInit {
  @ViewChildren('form') form;

  documentForm: FormGroup;

  state = 'counter-offer';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.documentForm = this.fb.group({});
  }

}
