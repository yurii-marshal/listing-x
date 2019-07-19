import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationErrorComponent } from './components/form-validation-error/form-validation-error.component';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatRadioModule,
  MatTabsModule
} from '@angular/material';
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
import { AddressesService } from '../core-modules/core-services/addresses.service';
import { WriteOfferDialogComponent } from './dialogs/write-offer-dialog/write-offer-dialog.component';
import { OfferService } from '../core-modules/core-services/offer.service';
import { DialogsWrapperComponent } from './components/dialogs-wrapper/dialogs-wrapper.component';
import { WriteOfferStepTwoDialogComponent } from './dialogs/write-offer-step-two-dialog/write-offer-step-two-dialog.component';
import { WriteOfferUploadDocumentsDialogComponent } from './dialogs/write-offer-upload-documents-dialog/write-offer-upload-documents-dialog.component';

const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  OverlayModule,
  MatTabsModule,
  MatBadgeModule,
  MatRadioModule
];

const dialogs = [
  AddressDialogComponent,
  WriteOfferDialogComponent,
  WriteOfferStepTwoDialogComponent,
  WriteOfferUploadDocumentsDialogComponent,
];

const components = [
  FormValidationErrorComponent,
  ArrayPipe,
  DebounceClickDirective,
  BaseTemplateComponent,
  EmptyPageComponent,
  ConfirmationBarComponent,
  CopyToClipboard,
  DialogsWrapperComponent,
  ...dialogs
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
    ...dialogs
  ],
  providers: [
    AddressesService,
    OfferService
  ]
})
export class SharedModule {
}
