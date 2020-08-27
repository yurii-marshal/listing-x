import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-agreement-mode-switcher',
  templateUrl: './agreement-mode-switcher.component.html',
  styleUrls: ['./agreement-mode-switcher.component.scss']
})
export class AgreementModeSwitcherComponent {
  @Input() show: boolean = true;
  @Input() disabled: boolean = false;
  @Input() isChecked: boolean;

  @Output() changeMode: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  changed(val: boolean) {
    this.changeMode.emit(val);
  }

}
