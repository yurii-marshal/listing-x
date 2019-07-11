import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationErrorComponent } from './components/form-validation-error/form-validation-error.component';
import { MatBadgeModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatTabsModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { ArrayPipe } from './pipes/array.pipe';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { BaseTemplateComponent } from './components/base-template/base-template.component';
import { EmptyPageComponent } from './components/empty-page/empty-page.component';
import { RouterModule } from '@angular/router';
import { AddressDialogComponent } from './dialogs/address-dialog/address-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmationBarComponent } from './components/confirmation-bar/confirmation-bar.component';
import { CopyToClipboard } from './directives/copy-to-clipboard';
import { AddressesService } from '../feature-modules/addresses/addresses.service';

const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  OverlayModule,
  MatTabsModule,
  MatBadgeModule
];

const components = [
  FormValidationErrorComponent,
  ArrayPipe,
  DebounceClickDirective,
  BaseTemplateComponent,
  EmptyPageComponent,
  AddressDialogComponent,
  ConfirmationBarComponent,
  CopyToClipboard
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ...materialModules
  ],
  declarations: [
    ...components,
  ],
  exports: [
    ...components
  ],
  entryComponents: [
    ConfirmationBarComponent,
    AddressDialogComponent,
  ],
  providers: [
    AddressesService
  ]
})
export class SharedModule {
}
