import { Component, OnInit, Type } from '@angular/core';
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
              private route: ActivatedRoute,
              private overlay: Overlay) { }

  ngOnInit() {
    this.openDialog();
  }

  openDialog() {
    const provider = this.route.snapshot.data.component as Type<Component>;
    const dialogRef = this.dialog.open(provider, {
      width: '600px',
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        ...this.route.snapshot.data,
        isEdit: !!this.route.parent.snapshot.params.id,
        transactionId: this.route.parent.snapshot.params.id
      }
    });
  }

}
