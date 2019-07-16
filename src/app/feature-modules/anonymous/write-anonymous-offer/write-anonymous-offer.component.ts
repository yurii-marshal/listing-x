import { Component, OnInit } from '@angular/core';
import { WriteOfferDialogComponent } from '../../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { filter, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Offer } from '../../../core-modules/models/offer';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-write-offer',
  template: '',
  styleUrls: ['./write-anonymous-offer.component.scss']
})
export class WriteAnonymousOfferComponent implements OnInit {

  // TODO:: refactor using dialog wrapper
  constructor(private dialog: MatDialog,
              private service: OfferService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const token = this.route.snapshot.params.token;
    this.service.getAnonymousOffer(token)
      .pipe(
        tap({error: err => this.router.navigateByUrl('/error/expired')})
      )
      .subscribe((model: Offer) => this.openDialog(model));
  }

  private openDialog(offer: Offer) {
    const dialogRef = this.dialog.open(WriteOfferDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {model: offer, isAnonymous: true}
    });

    dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult),)
      .subscribe((model: Offer) => {
        localStorage.setItem(LocalStorageKey.Offer, JSON.stringify(model.serialize()));
        this.router.navigate(['/auth/login']);
      });
  }
}
