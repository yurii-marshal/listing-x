import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formControlName][timeMask]'
})
export class TimeFormatDirective implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(private el: ElementRef,
              private _timerControl: NgControl,
              ) {
  }

  private _preValue: string;

  @Input()
  set preValue(value: string) {
    this._preValue = value;
  }

  ngOnInit() {
    this.timeValidate();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  timeValidate() {
    this.sub = this._timerControl.control.valueChanges.subscribe(data => {
      console.log(this._preValue, data);
      let newVal = data.replace(/\D/g, '');

      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 2) {
        newVal = newVal.replace(/^(\d{0})/, '$1');
      } else if (newVal.length >= 3) {
        newVal = newVal.replace(/^(\d{0,2})(\d{0,2})/, '$1:$2');
      }

      this._timerControl.control.setValue(newVal);
    });
  }
}
