import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Input()
  debounceTime = 300;

  @Output()
  debounceClick = new EventEmitter();

  private clicks: Subject<MouseEvent>;
  private subscription: Subscription;


  ngOnInit() {
    this.clicks = new Subject();
    this.subscription = this.clicks
      .pipe(
        debounceTime(this.debounceTime)
      )
      .subscribe(e => this.debounceClick.emit(e));
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();

    this.clicks.next(event);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
