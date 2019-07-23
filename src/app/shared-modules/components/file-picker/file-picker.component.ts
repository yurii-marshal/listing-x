import { AfterViewInit, Component, Directive, forwardRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';
import { ENTER } from '@angular/cdk/keycodes';
import { Document } from '../../../core-modules/models/document';
import { DocumentLinkingService } from '../../../core-modules/core-services/document-linking.service';
import * as _ from 'lodash';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';


@Directive({
  selector: '[role="option"]',
  host: {
    '[class.active-option]' : 'isActive'
  }
})
export class FileOption implements Highlightable {
  isActive: boolean;

  isChecked: boolean; // TODO:

  setActiveStyles(): void {
    this.isActive = true;
  }

  setInactiveStyles(): void {
    this.isActive = false;
  }
}

const COMPONENT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FilePickerComponent),
  multi: true,
};

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss'],
  providers: [COMPONENT_VALUE_ACCESSOR]
})
export class FilePickerComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input()
  type: UploadDocumentType;

  @ViewChildren(FileOption) options: QueryList<FileOption>;

  keyKeyManager: ActiveDescendantKeyManager<FileOption>;

  selectedDocument: Document;

  documents: Document[];

  title: string;

  isDisabled: boolean;

  protected onModelChange = (value: any) => {};

  protected onTouch = () => {};

  constructor(private service: DocumentLinkingService) {
  }

  ngOnInit() {
    this.title = this._title;
    this.reloadFilesList();
  }


  ngAfterViewInit(): void {
    this.keyKeyManager = new ActiveDescendantKeyManager(this.options).withWrap();
  }

  keyDownHandler(event: KeyboardEvent): void {
    if (event.keyCode === ENTER) {
      // TODO: select
    } else {
      this.keyKeyManager.onKeydown(event);
    }
  }

  onClick(index: number) {
    // FIXME: selectedDocument
    this.keyKeyManager.setActiveItem(index);
  }

  onSelectFilesForUpload(files: File[]) {
    this.service.upload(files, this.type)
      .subscribe(() =>  this.reloadFilesList()); // reload list
  }

  /**
   * ControlValueAccessor
   * */
  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    console.log('Value', obj);
    // TODO: go though viewchildren
  }


  private reloadFilesList() {
    this.service.loadListDocumentsByType(this.type)
      .subscribe(docs => this.documents = docs);

  }

  private get _title(): string {
    switch (this.type) {
      case UploadDocumentType.PreApproval:
        return 'Add Pre-approval Letter';
      case UploadDocumentType.FundsProof:
        return 'Add Proof of Funds';
      case UploadDocumentType.CoverLetter:
        return 'Add Cover Letter';
    }
  }
}
