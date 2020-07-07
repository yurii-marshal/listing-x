import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Document } from '../../../core-modules/models/document';

@Component({
  selector: 'app-selected-file-item',
  template: `
    <div class="file-item u-flex u-flex-align-items--center">
      <img src="assets/images/icons/{{item?.extension}}.svg" alt="{{item?.extension}}">
      <div class="title">{{item?.title}}</div>
    </div>
    <button class="remove-btn" mat-icon-button (click)="removeItem()">
      <img class="remove-icon" src="assets/images/icons/remove-icon.svg" alt="remove">
    </button>
  `,
  styleUrls: ['./selected-file-item.component.scss']
})
export class SelectedFileItemComponent {

  @Input() item: Document;

  @Output() remove: EventEmitter<Document> = new EventEmitter();

  constructor() {
  }

  removeItem() {
    this.remove.emit();
  }

}
