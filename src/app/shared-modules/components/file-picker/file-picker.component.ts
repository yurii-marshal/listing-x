import { AfterViewInit, Component, Directive, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';
import { ENTER } from '@angular/cdk/keycodes';
import { UploadedDocument } from '../../../core-modules/models/uploaded-document';
import { tap } from 'rxjs/operators';

@Directive({
  selector: '[role="option"]',
  host: {
    '[class.active-option]' : 'isActive'
  }
})
export class FileOption implements Highlightable {
  isActive = false;

  setActiveStyles(): void { // press down
    this.isActive = true;
  }

  setInactiveStyles(): void {
    this.isActive = false;
  }
}

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss']
})
export class FilePickerComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input()
  type: UploadDocumentType;

  @ViewChildren(FileOption) options: QueryList<FileOption>;

  keyKeyManager: ActiveDescendantKeyManager<FileOption>;

  selectedDocument: UploadedDocument;

  documents: UploadedDocument[];

  constructor(private service: OfferService) {
  }

  ngOnInit() {
    this.service.loadDocuments(this.type)
      .subscribe(docs => this.documents = docs);
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
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
  }


  private reloadFilesList() {
    // TODO:
  }
}
