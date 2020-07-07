import { Component, EventEmitter, forwardRef, HostBinding, HostListener, Input, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const FILE_UPLOADER_COMPONENT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileUploaderComponent), // tslint:disable-line
  multi: true,
};


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'file-uploader',
  template: `
    <div [class.shortened]="shortened" class="uploader-container u-flex u-flex-direction--column u-flex-align-items--center">
      <input #fileInput
             type="file"
             name="file"
             [id]="uniqueId"
             [attr.accept]="fileTypes"
             accept="image/*"
             multiple="true"
             (change)="onFilesSelect()">

      <img class="upload-icon" src="../../../../assets/images/icons/{{iconName}}.svg" alt="upload-file-icon">
      <div class="title">Drag and drop Files Here to Upload</div>
      <div *ngIf="shortened" class="plain-text">or</div>
      <div *ngIf="!shortened" class="subtitle">Maximum upload file size: {{ maxFileSize }} MB. Download format: .doc .pdf</div>

      <label [for]="uniqueId">
        <ng-content></ng-content>
      </label>
    </div>
  `,
  styleUrls: ['./file-uploader.component.scss']
  // providers: [FILE_UPLOADER_COMPONENT_VALUE_ACCESSOR]
})
export class FileUploaderComponent {

  uniqueId = _.uniqueId('file_');

  @Input()
  maxFileSize: number = 3; // Mb

  @Input()
  fileTypes = '.pdf, .doc, .docx'; // application/msword,application/pdf

  @Input()
  shortened = false;

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onFileSelect: EventEmitter<File[]> = new EventEmitter<File[]>();

  @ViewChild('fileInput', {static: false})
  fileInput: any;

  @HostBinding('style.background-color')
  private background = '#ffffff';

  @HostBinding('style.opacity')
  private opacity = '1';

  iconName: string = 'upload-file-icon';

  constructor(private snackBar: MatSnackBar) {
  }

  // Dragover listener
  @HostListener('dragover', ['$event'])
  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8';
    this.iconName = 'upload-file-icon-active';
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.background = '#ffffff';
    this.opacity = '1';
    this.iconName = 'upload-file-icon';
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(e) {
    e.preventDefault();
    e.stopPropagation();

    this.background = '#ffffff';
    this.opacity = '1';
    this.iconName = 'upload-file-icon-active';
    const files = e.dataTransfer.files as FileList;
    if (files.length > 0) {
      this.upload(files);
    }
  }

  onFilesSelect() {
    const fileList: FileList = this.fileInput.nativeElement.files;
    if (fileList.length > 0) {
      this.upload(fileList);
    }
  }

  upload(fileList: FileList) {
    const files = Array.from(fileList);

    const config = {duration: 7000, panelClass: 'error-bar'};
    if (!this.isSupportedExtensions(files)) {
      this.snackBar.open('Unsupported file extension', 'OK', config);
    } else if (this.calculateTotalSize(files) > this.maxFileSize * 1024 * 1024) {
      this.snackBar.open(`File exceeds size limit (${this.maxFileSize}Mb)`, 'OK', config);
    } else {
      this.onFileSelect.emit(files);
    }

    this.resetSelectedFiles();
  }

  isSupportedExtensions(files: File[]): boolean {
    if (this.fileTypes === '*') {
      return  true;
    }
    return _.every(files, ({name}) => this.fileTypes.includes(this.getExtension(name)));
  }

  private getExtension(filename: string): string {
    return filename.split('.').pop();
  }

  private calculateTotalSize(files: File[]): number {
    return _.reduce(files, (total, {size}) => total + size, 0);
  }

  private resetSelectedFiles() {
    this.fileInput.nativeElement.value = '';
  }

}
