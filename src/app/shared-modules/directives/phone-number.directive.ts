import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formControlName][phoneMask]'
})
export class PhoneNumberDirective implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(private el: ElementRef,
              private _phoneControl: NgControl,
              private renderer: Renderer2) {
  }

  private _preValue: string;

  @Input()
  set preValue(value: string) {
    this._preValue = value;
  }

  ngOnInit() {
    this.phoneValidate();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  phoneValidate() {
    this.sub = this._phoneControl.control.valueChanges.subscribe(data => {
      const preInputValue: string = this._preValue;
      const lastChar: string = preInputValue.substr(preInputValue.length - 1);
      let newVal = data.replace(/\D/g, '');

      let start = this.el.nativeElement.selectionStart;
      let end = this.el.nativeElement.selectionEnd;

      if (data.length < preInputValue.length) {
        if (preInputValue.length < start) {
          if (lastChar === ')') {
            newVal = newVal.substr(0, newVal.length - 1);
          }
        }

        if (newVal.length === 0) {
          newVal = '';
        } else if (newVal.length <= 3) {
          newVal = newVal.replace(/^(\d{0,3})/, '($1');
        } else if (newVal.length <= 6) {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
        }

        this._phoneControl.control.setValue(newVal, {emitEvent: false});
        this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start, end);

      } else {
        const removedD = data.charAt(start);

        if (newVal.length === 0) {
          newVal = '';
        } else if (newVal.length <= 3) {
          newVal = newVal.replace(/^(\d{0,3})/, '($1)');
        } else if (newVal.length <= 6) {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
        }

        if (preInputValue.length >= start) {
          if (removedD === '(') {
            start = start + 1;
            end = end + 1;
          }
          if (removedD === ')') {
            start = start + 2;
            end = end + 2;
          }
          if (removedD === '-') {
            start = start + 1;
            end = end + 1;
          }
          if (removedD === ' ') {
            start = start + 1;
            end = end + 1;
          }

          this._phoneControl.control.setValue(newVal, {emitEvent: false});
          this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start, end);

        } else {
          this._phoneControl.control.setValue(newVal, {emitEvent: false});
          this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start + 2, end + 2);
        }
      }
    });
  }
}
