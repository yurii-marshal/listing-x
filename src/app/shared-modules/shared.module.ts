import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationErrorComponent } from './components/form-validation-error/form-validation-error.component';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { ArrayPipe } from './pipes/array.pipe';
import { DebounceClickDirective } from './directives/debounce-click.directive';

const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  OverlayModule
];

@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  declarations: [
    FormValidationErrorComponent,
    ArrayPipe,
    DebounceClickDirective,
  ],
  exports: [
    FormValidationErrorComponent,
    ArrayPipe,
    DebounceClickDirective
  ]
})
export class SharedModule { }
