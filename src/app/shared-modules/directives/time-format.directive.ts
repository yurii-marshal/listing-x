import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formControlName][timeMask]'
})
export class TimeFormatDirective implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(
    private el: ElementRef,
    private _timerControl: NgControl,
  ) {
  }

  ngOnInit() {
    this.timeValidate();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  timeValidate() {
    this.sub = this._timerControl.control.valueChanges.subscribe(data => {
      let newVal = data.replace(/\D/g, '');

      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 2) {
        newVal = +newVal <= 12 ? newVal.replace(/^(\d{0})/, '$1') : '';
      } else if (newVal.length >= 3) {
        newVal = +(newVal.substr(2, 2)) < 60 ? newVal.replace(/^(\d{0,2})(\d{0,2})/, '$1:$2') : '';
      }

      this._timerControl.control.setValue(newVal, {emitEvent: false});
    });
  }
}
