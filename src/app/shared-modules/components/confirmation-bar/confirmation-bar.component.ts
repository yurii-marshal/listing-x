import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { filter, take } from 'rxjs/operators';
import { Address } from '../../../feature-modules/model';


@Component({
  selector: 'ol-confirmation-bar',
  template: `
    <span class="message" [innerHTML]="data.message"></span>

    <div class="button-bar">
      <button mat-button color="primary" *ngIf="data.dismiss" (click)="onDismiss()">{{ data.dismiss }}</button>
      <button mat-button color="accent" (click)="onConfirm()">{{ data.action || 'OK' }}</button>
    </div>
  `,
  styleUrls: ['confirmation-bar.component.scss'],
})
export class ConfirmationBarComponent implements OnInit {


  constructor(
    private router: Router,
    public snackBarRef: MatSnackBarRef<ConfirmationBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: {
      action: string,   /** Label for the action button. */
      dismiss: string,  /** Label for the dismiss button. */
      message: string
    }
  ) {
  }

  /* Auto hide on route change  */
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => this.onDismiss());
  }

  /** Confirm the snack bar. */
  onConfirm(): void {
    // this.snackBarRef.da
    this.snackBarRef.dismissWithAction();
  }

  /** Dismisses the snack bar. */
  onDismiss(): void {
    this.snackBarRef.dismiss();
  }
}
