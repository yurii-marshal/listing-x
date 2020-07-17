import { Component, OnInit } from '@angular/core';
import { WriteOfferDialogComponent } from '../../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { filter, tap } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Offer } from '../../../core-modules/models/offer';
import { OfferService } from '../../portal/services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';

@Component({
  selector: 'app-write-offer',
  template: '',
  styleUrls: ['./write-anonymous-offer.component.scss']
})
export class WriteAnonymousOfferComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private service: OfferService,
              private router: Router,
              private snackbar: MatSnackBar,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    const offer = this.route.snapshot.data.model as Offer;
    const token = this.route.snapshot.params.token;
    localStorage.setItem(LocalStorageKey.Offer, JSON.stringify({offer, token}));

    this.openDialog(offer, token);
  }

  private openDialog(model: Offer, token: string) {
    const dialogRef = this.dialog.open(WriteOfferDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {model, token}
    });

    dialogRef.afterClosed()
      .pipe(
        filter(dialogResult => !!dialogResult),
        tap(() => this.snackbar.open('The form information is saved and please login or register to continue.'))
      )
      .subscribe(() => this.router.navigate(['/auth/login']));
  }
}
