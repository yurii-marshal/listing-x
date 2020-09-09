import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddendumData } from '../../../../core-modules/models/document';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addendum-dialog',
  templateUrl: './addendum-dialog.component.html',
  styleUrls: ['./addendum-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddendumDialogComponent {
  form: FormGroup;
  isEdit: boolean = false;
  isConfirmMode: boolean = !this.data.allowEdit;

  private onDestroyed$: Subject<void> = new Subject<void>();

  get termsControl() {
    return this.form.get('terms');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {transactionId: number, docData: AddendumData, docId: number, allowEdit: boolean, allowSign: boolean},
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<AddendumDialogComponent>,
    private cdr: ChangeDetectorRef,
  ) {
    this.isEdit = !!data.docData;
    this.form = this.fb.group({
      addendumName: [this.isEdit ? data.docData.addendumName : '', [Validators.required, Validators.maxLength(255)]],
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

    this.transactionService.updateAddendum(requestData).pipe(
      takeUntil(this.onDestroyed$),
    ).subscribe((doc) => {
      this.isConfirmMode = true;
      this.cdr.detectChanges();
    });
  }

  finish(): void {
    this.dialogRef.close();

    if (this.data.allowSign) {
      this.router.navigate(['/e-sign/addendum', this.data.docId]);
    }
  }
}
