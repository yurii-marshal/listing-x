import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-validation-error',
  template: `
    <ng-container *ngFor="let control of baseControl | array">
      <div class="text-danger" *ngIf="control && control.errors && (control.dirty || control.touched)">
        <div *ngIf="control.errors.required"><small>This field is required</small></div>
        <div *ngIf="control.errors.maxlength"><small>More than {{ control.errors.maxlength.requiredLength }} symbols</small></div>
        <div *ngIf="control.errors.email"><small>Invalid email</small></div>
        <div *ngIf="control.errors.uniqemail"><small>User with this email address already exists.</small></div>
        <div *ngIf="control.hasError('passwords')"><small>Passwords should be the same</small></div>
        <!-- TODO: all possible validation errors -->
      </div>
    </ng-container>
  `,
  styleUrls: ['./form-validation-error.component.scss']
})
export class FormValidationErrorComponent {

  @Input()
  baseControl: AbstractControl;
}
