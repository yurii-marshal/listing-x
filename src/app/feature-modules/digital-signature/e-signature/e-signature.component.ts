import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SignatureBoxComponent, SignMode } from '../../../shared-modules/components/signature-box/signature-box.component';
import { filter, map, scan, switchMap, tap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';
import { FinishSigningDialogComponent } from '../dialogs/finish-signing-dialog/finish-signing-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from '../../../core-modules/models/transaction';
import { TransactionService } from '../../portal/services/transaction.service';
import * as _ from 'lodash';
import { LoanType } from '../../../core-modules/enums/loan-type';
import { GeneratedDocument } from '../../../core-modules/models/document';
import {GeneratedDocumentType} from '../../../core-modules/enums/upload-document-type';

@Component({
  selector: 'app-e-signature',
  templateUrl: './e-signature.component.html',
  styleUrls: ['./e-signature.component.scss']
})
export class ESignatureComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();

  signEnabled: boolean;

  progress: number; // %

  transaction: Transaction;
  doc: GeneratedDocument;

  LoanType = LoanType;

  @ViewChildren(SignatureBoxComponent)
  private signatures: QueryList<SignatureBoxComponent>;

  constructor(private dialog: MatDialog,
              private transactionService: TransactionService,
              private route: ActivatedRoute,
              private router: Router,
              private snackbar: MatSnackBar) { }

  ngOnInit() {
    const docId: number = Number(this.route.snapshot.params.id);
    this.transactionService.loadSignDocument(docId).pipe(
      tap((doc: GeneratedDocument) => this.doc = doc),
      switchMap((doc: GeneratedDocument) => this.transactionService.loadOne(doc.transaction))
    ).subscribe((transaction: Transaction) => this.transaction = transaction);
  }

  ngAfterViewInit(): void {
    /** Handle change amount of components */
    this.signatures.changes.pipe(
      switchMap(() =>  this.handleCurrentUserSignatureChanges())
    ).subscribe(() => this.signAnAgreement());
  }

  signAnAgreement() {
    const transactionId = this.transaction.id;
    this.openDialog()
      .pipe(
        switchMap(() => this.transactionService.sign(this.doc)),
        tap(() => this.snackbar.open('Successfully signed document', 'OK'))
      )
      .subscribe(() => this.router.navigate(['/portal/transactions/', transactionId]));
  }

  private handleCurrentUserSignatureChanges() {
    const signControlsSteams = _.chain(this.signatures.toArray())
      .filter('isCurrentUser')
      .map((component: SignatureBoxComponent) => component.sign)
      .value();

    const count: number = signControlsSteams.length;
    return merge(...signControlsSteams)
      .pipe(
        scan((total: number, state: SignMode) => total - state, count),
        tap((value: number) => this.progress = Math.ceil(100 * (count - value) / count)),
        map((diff: number) => diff === 0),
        tap(done => this.signEnabled = done),
        filter((done: boolean) => !!done)
      );
  }

  private openDialog(): Observable<void> {
    const dialogRef = this.dialog.open(FinishSigningDialogComponent, {width: '600px'});
    return dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult));
  }

  getUser(email: string, userType: 'sellers' | 'buyers' = 'sellers') {
    return this.transaction.offer[userType].find(i => i.email === email);
  }
}
