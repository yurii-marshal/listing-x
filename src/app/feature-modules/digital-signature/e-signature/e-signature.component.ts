import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SignatureBoxComponent, SignMode } from '../components/signature-box/signature-box.component';
import { filter, map, scan, switchMap, tap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';
import { FinishSigningDialogComponent } from '../dialogs/finish-signing-dialog/finish-signing-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from '../../../core-modules/models/transaction';
import { TransactionService } from '../../portal/services/transaction.service';
import * as _ from 'lodash';

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

  @ViewChildren(SignatureBoxComponent)
  private signatures: QueryList<SignatureBoxComponent>;

  constructor(private dialog: MatDialog,
              private transactionService: TransactionService,
              private route: ActivatedRoute,
              private router: Router,
              private snackbar: MatSnackBar) { }

  ngOnInit() {
    const transactionId: number = Number(this.route.snapshot.params.id);
    //FIXME: this.transactionService.loadSignDocument(transactionId)
    this.transactionService.loadOne(transactionId)
      .subscribe((transaction: Transaction) => this.transaction = transaction);
  }

  ngAfterViewInit(): void {
    this.signatures.changes // handle change amount of components
      .pipe(
        // FIXME: autosign  or fill empty controls (of another users)
        switchMap(() =>  this.handleCurrentUserSignatureChanges())
      )
      .subscribe(() => this.signAnAgreement());
  }

  signAnAgreement() {
    const transactionId = this.transaction.id;
    this.openDialog()
      .pipe(
        switchMap(() => this.transactionService.sign(transactionId)),
        tap(() => this.snackbar.open('Successfully signed document', 'OK'))
      )
      .subscribe(() => this.router.navigate(['/portal/transaction/', transactionId]))
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
      )
  }

  private openDialog(): Observable<void> {
    const dialogRef = this.dialog.open(FinishSigningDialogComponent, {width: '600px'});
    return dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult))
  }
}
