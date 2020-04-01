import { AfterViewInit, Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SpqQuestion} from '../../../../core-modules/models/spq-question';
import {Observable, of} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TransactionService} from '../../services/transaction.service';
import {tap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-spqdialog',
  templateUrl: './spq-dialog.component.html',
  styleUrls: ['./spq-dialog.component.scss']
})
export class SpqDialogComponent implements AfterViewInit {
  questionsStream: Observable<SpqQuestion[]>;
  form: FormGroup;
  isConfirmMode: boolean = false;

  get explanationControl() {
    return this.form.get('explanation');
  }

  get answers() {
    return this.form.get('questions') as FormArray;
  }

  constructor(@Inject(MAT_DIALOG_DATA) private data: {questions: SpqQuestion[], docId: number, explanation: string},
              public dialogRef: MatDialogRef<SpqDialogComponent>,
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
      explanation: [data.explanation || '', Validators.maxLength(2000)]
    });
  }

  ngAfterViewInit(): void {
    this.answers.valueChanges.subscribe((answers) => {
      const hasYesAnswer = answers.some((a) => a.answer);
      const validators = [Validators.maxLength(2000)];
      if (hasYesAnswer) {
        validators.push(Validators.required);
      }

      this.explanationControl.setValidators(validators);
      this.explanationControl.updateValueAndValidity();
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
