import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { GeneratedDocument } from '../../../core-modules/models/document';
import { Transaction } from '../../../core-modules/models/transaction';
import { TransactionService } from '../../portal/services/transaction.service';
import {filter, map, scan, switchMap, tap} from 'rxjs/operators';
import {SignatureBoxComponent, SignMode} from '../../../shared-modules/components/signature-box/signature-box.component';
import * as _ from 'lodash';
import {merge, Observable} from 'rxjs';
import {FinishSigningDialogComponent} from '../dialogs/finish-signing-dialog/finish-signing-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from 'src/app/core-modules/core-services/auth.service';

@Component({
  selector: 'app-spq-signature',
  templateUrl: './spq-signature.component.html',
  styleUrls: ['./spq-signature.component.scss']
})
export class SpqSignatureComponent implements AfterViewInit, OnInit {
  currentYear: number = new Date().getFullYear();

  doc: GeneratedDocument;
  transaction: Transaction;

  signEnabled: boolean;
  isAgent: boolean = this.authService.currentUser.accountType === 'agent';

  progress: number = 0;

  @ViewChildren(SignatureBoxComponent)
  private signatures: QueryList<SignatureBoxComponent>;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    const docId: number = +this.route.snapshot.params.id;
    this.transactionService.loadSignDocument(docId).pipe(
      tap((doc) => this.doc = doc),
      switchMap((doc) => this.transactionService.loadOne(doc.transaction))
    ).subscribe((transaction) => {
      if (this.isAgent) {
        this.signEnabled = transaction.pendingDocuments.find(doc => doc.id === docId).allowSign;
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
