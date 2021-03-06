import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../portal/services/transaction.service';
import { AddendumData, GeneratedDocument } from '../../../core-modules/models/document';
import { filter, map, scan, switchMap, tap } from 'rxjs/operators';
import { Transaction } from '../../../core-modules/models/transaction';
import { SignatureBoxComponent, SignMode } from '../../../shared-modules/components/signature-box/signature-box.component';
import * as _ from 'lodash';
import { merge, Observable } from 'rxjs';
import { FinishSigningDialogComponent } from '../../../shared-modules/dialogs/finish-signing-dialog/finish-signing-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core-modules/core-services/auth.service';

@Component({
  selector: 'app-addendum-signature',
  templateUrl: './addendum-signature.component.html',
  styleUrls: ['./addendum-signature.component.scss']
})
export class AddendumSignatureComponent implements AfterViewInit, OnInit {
  doc: GeneratedDocument;
  transaction: Transaction;

  signEnabled: boolean;
  isAgent: boolean = this.authService.currentUser.accountType === 'agent';

  docId: number;
  progress: number = 0;
  currentYear: number = new Date().getFullYear();

  get buyers() {
    return this.transaction.offer.buyers.map(user => `  ${user.firstName} ${user.lastName}`).join(', ');
  }

  get sellers() {
    return this.transaction.offer.sellers.map(user => `  ${user.firstName} ${user.lastName}`).join(', ');
  }

  get terms() {
    const {terms} = this.doc.documentData as AddendumData;
    const iterations = terms.length >= 5000 ? 0 : 5000 - terms.length;
    return `${terms}${new Array(iterations).join(' \xa0 ')}`;
  }

  @ViewChildren(SignatureBoxComponent)
  private signatures: QueryList<SignatureBoxComponent>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.docId = +this.route.snapshot.params.id;
    this.transactionService.loadSignDocument(this.docId).pipe(
      tap(doc => this.doc = doc),
      switchMap(doc => this.transactionService.loadOne(doc.transaction))
    ).subscribe(transaction => {
      if (this.isAgent) {
        this.signEnabled = transaction.pendingDocuments.find(doc => doc.id === this.docId).allowSign;
      }
      return this.transaction = transaction;
    });
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
}
