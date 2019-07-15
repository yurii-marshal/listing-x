import { Component, OnInit } from '@angular/core';
import { WriteOfferDialogComponent } from '../../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Offer } from '../../../core-modules/models/offer';
import { OfferService } from '../../../core-modules/core-services/offer.service';

@Component({
  selector: 'app-write-offer',
  templateUrl: './write-offer.component.html',
  styleUrls: ['./write-offer.component.scss']
})
export class WriteOfferComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private service: OfferService) { }

  ngOnInit() {
    const offer = new Offer();
    // TODO: retrieve buyers from LS and inject here
    const dialogRef = this.dialog.open(WriteOfferDialogComponent, {
      width: '600px',
      // height: '1050px',
      disableClose: true,
      data: {model: offer, isAnonymous: true} // FIXME: null
    });

    dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult),)
      .subscribe();
  }

}
