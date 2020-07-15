import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import numToWords from 'num-to-words';

@Directive({
  selector: '[appNumberToWords]'
})
export class NumberToWordsDirective implements OnDestroy {
  private defaultParams = {ands: true, commas: true};

  @Input() recipientControlName: string;
  @Input() numToWordsForm: FormGroup;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private el: ElementRef,
  ) {
    fromEvent(el.nativeElement, 'input')
      .pipe(
        takeUntil(this.onDestroyed$),
        debounceTime(300)
        )
      .subscribe(({target}) => {
        const converted = this.getInWords(target.value);
        this.numToWordsForm.get(this.recipientControlName).patchValue(converted);
      });
  }

  private getInWords(num: any, params = this.defaultParams): string {
    return num ? (+num ? numToWords(num, params) : 'NOT A NUMBER') : '';
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
