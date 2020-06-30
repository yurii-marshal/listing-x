import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationErrorComponent } from './components/form-validation-error/form-validation-error.component';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatProgressSpinnerModule,
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
import { DialogsWrapperComponent } from './components/dialogs-wrapper/dialogs-wrapper.component';
import { WriteOfferStepTwoDialogComponent } from './dialogs/write-offer-step-two-dialog/write-offer-step-two-dialog.component';
import {
  WriteOfferUploadDocumentsDialogComponent
} from './dialogs/write-offer-upload-documents-dialog/write-offer-upload-documents-dialog.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { TooltipContentComponent } from './components/tooltip-content/tooltip-content.component';
import { FileOption, FilePickerComponent } from './components/file-picker/file-picker.component';
import { A11yModule } from '@angular/cdk/a11y';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { WriteOfferSummaryComponent } from './dialogs/write-offer-summary/write-offer-summary.component';
import { OfferService } from '../feature-modules/portal/services/offer.service';
import { DocumentLinkingService } from '../feature-modules/portal/services/document-linking.service';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';

const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  OverlayModule,
  MatTabsModule,
  MatBadgeModule,
  MatRadioModule,
  A11yModule,
  MatProgressSpinnerModule,
];

const dialogs = [
  ConfirmationBarComponent,
  AddressDialogComponent,
  WriteOfferDialogComponent,
  WriteOfferStepTwoDialogComponent,
  WriteOfferUploadDocumentsDialogComponent,
  WriteOfferSummaryComponent,
  TooltipContentComponent,
];

const components = [
  FormValidationErrorComponent,
  ArrayPipe,
  DebounceClickDirective,
  BaseTemplateComponent,
  EmptyPageComponent,
  CopyToClipboard,
  DialogsWrapperComponent,
  TooltipDirective,
  FilePickerComponent,
  FileOption,
  FileUploaderComponent,
  CalendarComponent,
  NotificationBarComponent,
  FirstLetterPipe,
  ...dialogs,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FullCalendarModule,
    ...materialModules,
  ],
  declarations: [
    ...components,
  ],
  exports: [
    ...components,
  ],
  entryComponents: [
    ...dialogs,
  ],
  providers: [
    AddressesService,
    OfferService,
    DocumentLinkingService,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
