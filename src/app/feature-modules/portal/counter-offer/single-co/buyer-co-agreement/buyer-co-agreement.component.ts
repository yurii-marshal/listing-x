import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-buyer-co-agreement',
  templateUrl: './buyer-co-agreement.component.html',
  styleUrls: ['./../../counter-offer.scss', './buyer-co-agreement.component.scss']
})
export class BuyerCOAgreementComponent implements OnInit {
  @ViewChildren('form') form;

  documentForm: FormGroup;

  state = 'counter-offer';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.documentForm = this.fb.group({});
  }

}
