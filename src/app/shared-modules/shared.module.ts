import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationErrorComponent } from './components/form-validation-error/form-validation-error.component';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatTabsModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { ArrayPipe } from './pipes/array.pipe';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { BaseTemplateComponent } from './components/base-template/base-template.component';
import { EmptyPageComponent } from './components/empty-page/empty-page.component';
import { RouterModule } from '@angular/router';

const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  OverlayModule,
  MatTabsModule
];

const components  = [
  FormValidationErrorComponent,
  ArrayPipe,
  DebounceClickDirective,
  BaseTemplateComponent,
  EmptyPageComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...materialModules
  ],
  declarations: [
    ...components,
  ],
  exports: [
    ...components
  ]
})
export class SharedModule { }
