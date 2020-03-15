import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SpqQuestion} from '../../../../core-modules/models/spq-question';
import {Observable, of} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TransactionService} from "../../services/transaction.service";
import {tap} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-spqdialog',
  templateUrl: './spqdialog.component.html',
  styleUrls: ['./spqdialog.component.scss']
})
export class SPQDialogComponent {
  questionsStream: Observable<SpqQuestion[]>;
  form: FormGroup;
  isConfirmMode: boolean = false;

  get answers() {
    return this.form.get('questions') as FormArray;
  }

  constructor(@Inject(MAT_DIALOG_DATA) private data: {questions: SpqQuestion[], docId: number},
              public dialogRef: MatDialogRef<SPQDialogComponent>,
              private fb: FormBuilder,
              private transactionService: TransactionService,
              private snackbar: MatSnackBar) {
    this.questionsStream = of(data.questions);

    const initialAnswers: FormGroup[] = data.questions.map(i => this.fb.group({
      id: [i.id],
      answer: [i.answer, Validators.required]
    }));

    this.form = this.fb.group({
      questions: this.fb.array(initialAnswers),
      explanation: ['']
    });
  }

  confirm(): void {
    this.isConfirmMode = true;
  }

  finish(): void {
    this.transactionService.updateSpq(this.data.docId, this.form.value).pipe(
      tap(_ => this.snackbar.open('Spq updated...'))
    ).subscribe((data) => this.dialogRef.close());
  }
}
