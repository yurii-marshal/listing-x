import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SignatureBoxComponent, SignMode } from '../components/signature-box/signature-box.component';
import { filter, map, scan, tap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';
import { FinishSigningDialogComponent } from '../dialogs/finish-signing-dialog/finish-signing-dialog.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../../../core-modules/models/transaction';
import { TransactionService } from '../../portal/services/transaction.service';

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

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private transactionService: TransactionService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const transactionId: number = Number(this.route.snapshot.params.id);
    this.transactionService.loadOne(transactionId)
      .subscribe((transaction: Transaction) => this.transaction = transaction);
  }

  ngAfterViewInit(): void {
    const signSteams = this.signatures.map(component => component.sign);

    const count = this.signatures.length;
    merge(...signSteams)
      .pipe(
        scan((total: number, state: SignMode) => total - state, count),
        tap((value: number) => this.progress = Math.ceil(100 * (count - value) / count)),
        map((diff: number) => diff === 0),
        tap(done => this.signEnabled = done)
      )
      .subscribe(done => console.log('Done', done));
  }


  signAnAgreement() {
    this.openDialog()
      // TODO: switch map with service
      .subscribe(() => console.log('Sign: completelly done'))
  }

  openDialog(): Observable<void> {
    const dialogRef = this.dialog.open(FinishSigningDialogComponent, {width: '600px'});
    return dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult))
  }

}
