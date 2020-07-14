import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[appPhoneNumber]'
})
export class PhoneNumberDirective implements OnChanges, OnDestroy {
  @Input() mask: string = '()';
  @Input() phoneNumber: string;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter();

  actualValue: string = '';
  transformedValue = '';

  currentSubscription: Subscription;

  constructor(
    private el: ElementRef,
  ) {
    fromEvent(el.nativeElement, 'input').subscribe(({target}) => {
      this.transformValue(target.value);
    });
  }

  transformValue(value: string) {
    value = value.replace(/\s/g, '');
    if (value.length > this.actualValue.length) {
      this.actualValue =
        this.actualValue + value.slice(this.actualValue.length, value.length);
      this.valueChanged.emit(this.actualValue);
    } else {
      this.actualValue = this.actualValue.slice(0, value.length);
      this.valueChanged.emit(this.actualValue);
    }

    this.transformedValue = this.formatValue(this.actualValue);
    this.el.nativeElement.value = this.transformedValue;
  }

  formatValue(value: any) {
    // TODO: ^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$
    return value
      .replace(/[0-9]{3}/, `(${value})`)
      .replace(/([\w*]{4})/g, '$1 ')
      .trim();
  }

  ngOnChanges(changes: SimpleChanges) {
    const phoneNumber = changes.phoneNumber;

    if (phoneNumber && phoneNumber.firstChange) {
      this.transformValue(this.phoneNumber);
    }
  }

  ngOnDestroy() {
    this.currentSubscription.unsubscribe();
  }

}
