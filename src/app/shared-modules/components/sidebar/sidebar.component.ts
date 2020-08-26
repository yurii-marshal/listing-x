import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() opened: boolean = false;
  @Input() isEnable: boolean = true;
  @Output() openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() okButtonText: string = 'Continue';

  @Input() isSignMode: boolean = false;

  @Output() continue: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

  okButtonAction() {
    this.continue.emit();
  }

}
