import { Component, OnInit } from '@angular/core';
import { WriteOfferDialogComponent } from '../../../shared-modules/dialogs/write-offer-dialog/write-offer-dialog.component';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-write-offer',
  templateUrl: './write-offer.component.html',
  styleUrls: ['./write-offer.component.scss']
})
export class WriteOfferComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {

    const dialogRef = this.dialog.open(WriteOfferDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {model: null, verbose: true}
    });

    dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult),)
      .subscribe();
  }

}
