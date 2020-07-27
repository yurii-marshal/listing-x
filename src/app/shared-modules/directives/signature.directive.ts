import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core-modules/core-services/auth.service';

@Directive({
  selector: '[appSignature]'
})
export class SignatureDirective implements OnInit {
  @Input() sign: string;
  @Input() withDateControl: string;

  private signButtonEl: HTMLElement;

  constructor(
    private el: ElementRef,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private ngControl: NgControl,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    if (!this.sign) {
      this.sign =
        `${
          this.authService.currentUser.firstName.substr(0, 1).toUpperCase()
          }. ${
          this.authService.currentUser.lastName.substr(0, 1).toUpperCase()
          }.`;
    }
  }

  @HostListener('focus', ['$event']) focus() {
    this.signButtonEl
      ? this.removeSignButton()
      : setTimeout(() => {
        this.renderSignButton();
      }, 200);
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

    this.setButtonStyles();
  }

  private removeSignButton() {
    this.renderer.removeClass(this.signButtonEl, 'sign-button');
    this.renderer.removeChild(this.el.nativeElement.parentNode, this.signButtonEl);
    this.signButtonEl = null;
  }

  private signFields() {
    this.ngControl.control.patchValue(this.sign);
    this.ngControl.control.disable();

    if (this.withDateControl) {
      // TODO: find access to parent control by DI
      this.ngControl['_parent'].control.get(this.withDateControl).patchValue(this.datePipe.transform(new Date().getTime(), 'yyyy-MM-dd'));
      this.ngControl['_parent'].control.get(this.withDateControl).disable();
    }

    this.renderer.addClass(this.el.nativeElement, 'sign-input');

    this.removeSignButton();
  }

  private setButtonStyles() {
    const signField = this.el.nativeElement;

    this.renderer.setStyle(this.signButtonEl, 'margin-top', signField.offsetHeight + 'px');
    this.renderer.setStyle(this.signButtonEl, 'left', signField.offsetLeft + 'px');

    this.renderer.addClass(this.signButtonEl, 'sign-button');
  }

}
