import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TransactionService} from '../../services/transaction.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AddendumData} from '../../../../core-modules/models/document';

@Component({
  selector: 'app-addendum-dialog',
  templateUrl: './addendum-dialog.component.html',
  styleUrls: ['./addendum-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddendumDialogComponent {
  form: FormGroup;
  isEdit: boolean = false;

  get termsControl() {
    return this.form.get('terms');
  }

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<AddendumDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {transactionId: number, docData: AddendumData, docId: number}
  ) {
    this.isEdit = !!data.docData;
    this.form = this.fb.group({
      addendumName: [this.isEdit ? data.docData.addendumName : '', Validators.required],
      terms: [this.isEdit ? data.docData.terms : '', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  create(): void {
    const requestData = this.form.getRawValue();
    this.transactionService.createAddendum(this.data.transactionId, requestData)
      .subscribe((doc) => this.dialogRef.close(doc));
  }

  update(): void {
    const requestData = {
      ...this.form.getRawValue(),
      id: this.data.docId
    };

    this.transactionService.updateAddendum(requestData)
      .subscribe((doc) => this.dialogRef.close(doc));
  }
}
