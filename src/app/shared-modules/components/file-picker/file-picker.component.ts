import { AfterViewInit, Component, Directive, forwardRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';
import { ENTER } from '@angular/cdk/keycodes';
import { Document } from '../../../core-modules/models/document';
import { DocumentLinkingService } from '../../../core-modules/core-services/document-linking.service';
import * as _ from 'lodash';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';
import { MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';


@Directive({
  selector: '[role="checkbox"]',
  host: {
    '[class.active-option]': 'isActive'
  }
})
export class FileOption implements Highlightable {
  isActive: boolean;

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

  @ViewChildren(FileOption)
  options: QueryList<FileOption>;

  keyKeyManager: ActiveDescendantKeyManager<FileOption>;

  dataSource: Document[];

  title: string;

  isDisabled: boolean;

  selectedItems: number[];

  protected onModelChange = (value: any) => {
  };

  protected onTouch = () => {
  };

  constructor(private service: DocumentLinkingService,
              private snakbar: MatSnackBar) {
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

  onClick(item: Document) {
    if (!this.isDisabled) {
      item.checked = !item.checked;
      this.onModelChange(this.dataSource.filter(item => item.checked).map(item => item.id));
    }
  }

  onSelectFilesForUpload(files: File[]) {
    this.service.upload(files, this.type)
      .subscribe(() => this.reloadFilesList()); // reload list
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

  writeValue(items: number[]): void {
    this.selectedItems = items;
    this.preselect();
  }

  private reloadFilesList() {
    this.service.loadListDocumentsByType(this.type)
      .subscribe(docs => {
        this.dataSource = docs;
        this.preselect();
      });
  }

  private preselect() {
    _.forEach(this.dataSource, (item: Document) => {
      item.checked = _.includes(this.selectedItems, item.id);
    });
  }

  private get _title(): string {
    switch (this.type) {
      case UploadDocumentType.preApproval:
        return 'Add Pre-approval Letter';
      case UploadDocumentType.proofOfFunds:
        return 'Add Proof of Funds';
      case UploadDocumentType.coverLetter:
        return 'Add Cover Letter';
    }
  }
}
