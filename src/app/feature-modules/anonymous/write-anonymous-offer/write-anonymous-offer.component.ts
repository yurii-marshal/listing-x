import { Component, OnInit } from '@angular/core';
import { WriteOfferDialogComponent } from '../../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { filter, map, tap } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Offer } from '../../../core-modules/models/offer';
import { OfferService } from '../../../core-modules/core-services/offer.service';
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
              private route: ActivatedRoute) { }

  ngOnInit() {
    const token = this.route.snapshot.params.token;
    this.service.getAnonymousOffer(token)
      .pipe(
        tap({error: err => this.router.navigateByUrl('/error/expired')})
      )
      .subscribe((model: Offer) => this.openDialog(model));
  }

  private openDialog(model: Offer) {
    const dialogRef = this.dialog.open(WriteOfferDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {model, isAnonymous: true}
    });

    dialogRef.afterClosed()
      .pipe(
        filter(dialogResult => !!dialogResult),
        map((offer: Offer) => ({offer, token: this.route.snapshot.params.token})),
        tap((data: {offer: Offer, token: string}) => localStorage.setItem(LocalStorageKey.Offer, JSON.stringify(data))),
        tap(() => this.snackbar.open('The form information is saved and please login or register to continue.'))
      )
      .subscribe( () => this.router.navigate(['/auth/login']));
  }
}
