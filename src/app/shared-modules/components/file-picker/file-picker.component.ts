import {
  AfterViewInit,
  Component,
  Directive,
  forwardRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';
import { ENTER } from '@angular/cdk/keycodes';
import { Document } from '../../../core-modules/models/document';
import { DocumentLinkingService } from '../../../feature-modules/portal/services/document-linking.service';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';

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

  @Input()
  offerId: number = null;

  @Input()
  docsIds: number[] = [];

  @ViewChildren(FileOption)
  options: QueryList<FileOption>;

  keyKeyManager: ActiveDescendantKeyManager<FileOption>;

  dataSource: Document[] = [];

  title: string;

  isDisabled: boolean;

  selectedItems: Document[] = [];

  protected onModelChange = (value: any) => {
  };

  protected onTouch = () => {
  };

  constructor(private service: DocumentLinkingService,
              private snakbar: MatSnackBar) {
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

  ngOnInit() {
    this.title = this._title;
    this.reloadFilesList();
  }

  ngAfterViewInit(): void {
    this.keyKeyManager = new ActiveDescendantKeyManager(this.options).withWrap();
  }

  keyDownHandler(event: KeyboardEvent): void {
    if (event.keyCode === ENTER) {
      // select
    } else {
      this.keyKeyManager.onKeydown(event);
    }
  }

  onClick(item: Document) {
    if (!this.isDisabled) {
      item.checked = !item.checked;
      this.invalidateModel();
    }
  }

  onSelectFilesForUpload(files: File[]) {
    this.service.upload(files, this.type)
      .subscribe((items: Document[]) => this.mergeNewFiles(items));
  }

  removeSelectedItem(index: number) {
    this.dataSource.forEach((document) => {
      if (document.id === this.selectedItems[index].id) {
        document.checked = false;
      }
    });

    this.selectedItems.splice(index, 1);
    this.onModelChange(this.selectedItems);
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(items: Document[]): void {
    this.selectedItems = items;

    this.preselectSource();
  }

  private invalidateModel() {
    this.selectedItems = _.chain(this.dataSource)
      .filter('checked')
      .value();

    this.onModelChange(this.selectedItems);
  }

  private mergeNewFiles(items: Document[]) {
    if (!this.isDisabled) {
      items.forEach(file => file.checked = true);
    }
    this.dataSource = [...items, ...this.dataSource];
    this.invalidateModel();
  }

  private reloadFilesList() {
    this.service.loadListDocumentsByType(this.type, this.offerId)
      .subscribe(docs => {
        this.dataSource = docs;
        if (this.docsIds) {
          this.selectedItems = this.docsIds.map(id => docs.find(doc => doc.id === id));
          this.onModelChange(this.selectedItems);
        }
        this.preselectSource();
      });
  }

  private preselectSource() {
    _.forEach(this.dataSource, (item: Document) => {
      item.checked = _.includes(this.selectedItems.map(i => i.id), item.id);
    });
  }
}
