import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][timeMask]'
})
export class TimeFormatDirective {

  constructor(
    private el: ElementRef,
    private _timerControl: NgControl,
  ) {
  }

  @HostListener('input') onChanges() {
    let newVal = this.el.nativeElement.value.replace(/\D/g, '');

    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 2) {
      newVal = +newVal <= 12 ? newVal.replace(/^(\d{0})/, '$1') : '';
    } else if (newVal.length >= 3) {
      newVal = +(newVal.substr(2, 2)) < 60 ? newVal.replace(/^(\d{0,2})(\d{0,2})/, '$1:$2') : '';
    }

    this._timerControl.control.setValue(newVal, {emitEvent: false});
  }
}
