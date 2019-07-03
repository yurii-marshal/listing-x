import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationErrorComponent } from './components/form-validation-error/form-validation-error.component';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ArrayPipe } from './pipes/array.pipe';

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
    FileUploaderComponent,
    ArrayPipe
  ],
  exports: [
    FormValidationErrorComponent,
    ArrayPipe
  ]
})
export class SharedModule { }
