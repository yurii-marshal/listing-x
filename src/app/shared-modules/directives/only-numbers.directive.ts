import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[formControlName][appOnlyNumbers]'
})
export class OnlyNumbersDirective implements OnInit {
  @Input() appOnlyNumbers: '' | 'float';
  @Input() maxLength = 19; // max value of bigint size
  private regex: RegExp;
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(
    private el: ElementRef,
  ) {
  }

  ngOnInit() {
    switch (this.appOnlyNumbers) {
      case 'float':
        this.regex = new RegExp(/^(0|0?[1-9]\d*)\.?\d?\d?$/);
        break;
      default:
        this.regex = new RegExp(/^[0-9]*$/g);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) > -1) {
      return;
    }

    if (this.appOnlyNumbers === 'float') {
      this.maxLength = (this.el.nativeElement.value.includes('.') || event.key === '.') ? 12 : 9;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex) || current.length === this.maxLength) {
      event.preventDefault();
    }
  }

}
