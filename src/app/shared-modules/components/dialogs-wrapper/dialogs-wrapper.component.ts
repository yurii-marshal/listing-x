import { Component, OnInit, Type } from '@angular/core';
import { Offer } from '../../../core-modules/models/offer';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dialogs-wrapper',
  template: '',
  styleUrls: ['./dialogs-wrapper.component.scss']
})
export class DialogsWrapperComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.snapshot.data
    this.openWriteOfferDialog(new Offer());
  }

  openWriteOfferDialog(offer: Offer, isEdit: boolean = true) {
    const provider = this.route.snapshot.data.component as Type<Component>;
    const dialogRef = this.dialog.open(provider, {
      width: '600px',
      disableClose: true,
      data: {model: offer, isEdit}
    });

    dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult))
      .subscribe((model: Offer) => {
        // navigate to parent or redirect url
        // TODO: Navigate to step 2
      });
  }

}
