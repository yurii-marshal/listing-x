import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { FormGroup, NgControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Directive({
  selector: '[appSignature]'
})
export class SignatureDirective {
  @Input() sign: string;
  @Input() dateControlName: string;

  private signButtonEl: HTMLElement;

  constructor(
    private el: ElementRef,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private ngControl: NgControl,
  ) {
  }

  @HostListener('focus', ['$event']) focus() {
    console.log(this.ngControl);
    this.signButtonEl ? this.removeSignButton() : this.renderSignButton();
  }

  @HostListener('document:click', ['$event']) blur($event) {
    if (
      this.signButtonEl
      && !this.signButtonEl.contains($event.target)
      && !this.el.nativeElement.contains($event.target)
    ) {
      this.removeSignButton();
    }
  }

  private renderSignButton() {
    this.signButtonEl = this.renderer.createElement('button');

    this.renderer.appendChild(this.signButtonEl, this.renderer.createText('Sign'));
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.signButtonEl);
    this.renderer.listen(this.signButtonEl, 'click', () => this.signFields());

    this.renderer.addClass(this.el.nativeElement, 'sign-input');
    this.renderer.addClass(this.signButtonEl, 'sign-button');

    this.setButtonStyles();
  }

  private removeSignButton() {
    this.renderer.removeClass(this.el.nativeElement, 'sign-input');
    this.renderer.removeClass(this.signButtonEl, 'sign-button');
    this.renderer.removeChild(this.el.nativeElement.parentNode, this.signButtonEl);
    this.signButtonEl = null;
  }

  private signFields() {
    // TODO: find access to parent control by DI
    this.ngControl.control.patchValue(this.sign);
    this.ngControl['_parent'].control.get(this.dateControlName).patchValue(this.datePipe.transform(new Date().getTime(), 'yyyy-MM-dd'));
    this.ngControl.control.disable();
    this.ngControl['_parent'].control.get(this.dateControlName).disable();

    this.removeSignButton();
  }

  private setButtonStyles() {
    const signField = this.el.nativeElement;

    this.renderer.setStyle(this.signButtonEl, 'top', signField.offsetTop + signField.clientHeight + 'px');
    this.renderer.setStyle(this.signButtonEl, 'left', signField.offsetLeft + 'px');
  }

}
