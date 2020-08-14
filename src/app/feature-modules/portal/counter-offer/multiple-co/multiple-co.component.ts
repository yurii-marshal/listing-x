import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multiple-co',
  templateUrl: './multiple-co.component.html',
  styleUrls: ['./../counter-offer.scss', './multiple-co.component.scss']
})
export class MultipleCOComponent implements OnInit {
  @ViewChildren('form') form;
  isSideBarOpen: boolean;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;

  documentForm: FormGroup;

  state = 'counter-offer';

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.documentForm = this.fb.group({});
  }

  continue() {
    this.documentForm.markAllAsTouched();
  }

}
