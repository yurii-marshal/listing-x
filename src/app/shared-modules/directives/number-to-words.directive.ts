import { Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import numbered from 'numbered';

@Directive({
  selector: '[appNumberToWords]'
})
export class NumberToWordsDirective implements OnDestroy {
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

  private getInWords(num: any): string {
    return num ? (+num ? numbered.stringify(num) : 'NOT A NUMBER') : '';
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }
}
