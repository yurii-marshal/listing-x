import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formControlName][appOnlyNumbers]'
})
export class OnlyNumbersDirective implements OnInit, OnDestroy {
  @Input() appOnlyNumbers: '' | 'float';
  @Input() maxLength = 19; // max value of bigint size

  private regex: RegExp;
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home'];

  private sub: Subscription;

  constructor(
    private el: ElementRef,
    private ngControl: NgControl,
  ) {
  }

  ngOnInit() {
    switch (this.appOnlyNumbers) {
      case 'float':
        this.regex = new RegExp(/^(0|0?[1-9]\d*)\.?\d?\d?$/);
        this.subscribeToChanges();
        break;
      default:
        this.regex = new RegExp(/^[0-9]*$/g);
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) > -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);

    if (this.appOnlyNumbers === 'float') {
      next = next.replace(',', '');
      this.maxLength = (next.includes('.') || event.key === '.') ? 14 : 11;
    }

    if (next && !String(next).match(this.regex) || current.length >= this.maxLength) {
      event.preventDefault();
    }
  }

  private subscribeToChanges() {
    this.createInsertString();

    this.sub = this.ngControl.control.valueChanges.subscribe((data) => {
      let newVal = (data.split('.')[0]).replace(',', '');
      const decimalPlaces = data.split('.')[1];

      if (+data >= 1000 && +data < 1000000) {
        newVal = newVal.insert(',', newVal.length - 3);
      } else if (+data >= 1000000 && +data < 1000000000) {
        newVal = newVal.insert(',', newVal.length - 6).insert(',', newVal.length - 2);
      }

      this.el.nativeElement.value = newVal + (decimalPlaces ? '.' + decimalPlaces : '');
    });
  }

  private createInsertString() {
    String.prototype['insert'] = function(what, index) {
      return index > 0
        ? this.replace(new RegExp('.{' + index + '}'), '$&' + what)
        : what + this;
    };
  }

}
