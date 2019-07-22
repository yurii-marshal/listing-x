import { Component, OnInit, Type } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';

/**
 * Base wrapper for dialog available by some route
 * */
@Component({
  selector: 'app-dialogs-wrapper',
  template: '',
  styleUrls: ['./dialogs-wrapper.component.scss']
})
export class DialogsWrapperComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private overlay: Overlay) { }

  ngOnInit() {
    this.openWriteOfferDialog();
  }

  openWriteOfferDialog() {
    const model = this.route.snapshot.data.model;
    const provider = this.route.snapshot.data.component as Type<Component>;
    const dialogRef = this.dialog.open(provider, {
      width: '600px',
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        model,
        isEdit: !!this.route.snapshot.queryParams.offerId
      }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(dialogResult => !!dialogResult)
      )
      .subscribe();
  }

}
