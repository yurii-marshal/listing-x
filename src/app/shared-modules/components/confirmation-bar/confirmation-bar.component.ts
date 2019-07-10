import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { filter, take } from 'rxjs/operators';
import { Address } from '../../../feature-modules/model';


@Component({
  selector: 'ol-confirmation-bar',
  template: `
    <span class="message" [innerHTML]="data.message"></span>

    <div class="snackbar-action">
      <button mat-button color="primary" *ngIf="hasDismiss" (click)="onDismiss()">{{ data.dismiss }}</button>
      <button mat-button color="accent" (click)="onConfirm()">{{ data.action || 'OK' }}</button>
    </div>
  `,
  styleUrls: ['confirmation-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'confirmation-snackbar',
  }
})
export class ConfirmationBarComponent implements OnInit {
  /** Data that was injected into the snack bar. */
  data: {
    action: string, /** Label for the action button. */
    dismiss: string, /** Label for the dismiss button. */
    message: string
  };

  constructor(
    private router: Router,
    public snackBarRef: MatSnackBarRef<ConfirmationBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) data: any) {
      this.data = data;
  }

  get hasAction(): boolean {
    return !!this.data.action;
  }

  get hasDismiss(): boolean {
    return !!this.data.dismiss;
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
