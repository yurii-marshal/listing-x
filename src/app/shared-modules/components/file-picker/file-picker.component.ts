import { AfterViewInit, Component, Directive, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { UploadDocumentType } from '../../../core-modules/enums/upload-document-type';
import { ENTER } from '@angular/cdk/keycodes';

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

  selectedColor = '';

  colors = [
    {hex: '#F44336', name: 'Purple'},
    {hex: '#E91E63', name: 'Red'},
    {hex: '#673AB7', name: 'Pink'},
    {hex: '#3F51B5', name: 'Indigo'},
    {hex: '#00BCD4', name: 'Cyan'},
    {hex: '#4CAF50', name: 'Green'},
    {hex: '#FFEB3B', name: 'Yellow'},
    {hex: '#FF9800', name: 'Orange'},
    {hex: '#795548', name: 'Brown'},
  ];

  constructor(private service: OfferService) {
  }

  ngOnInit() {
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
