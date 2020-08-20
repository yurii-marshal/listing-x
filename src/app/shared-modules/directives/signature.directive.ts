import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core-modules/core-services/auth.service';
import { MatSnackBar } from '@angular/material';

@Directive({
  selector: '[appSignature]'
})
export class SignatureDirective implements OnInit {
  @Input() mode: 'sign' | 'initials' = 'sign';
  @Input() sign: string = `${this.authService.currentUser.firstName} ${this.authService.currentUser.lastName}`;
  @Input() initials: string = `${
    this.authService.currentUser.firstName.substr(0, 1).toUpperCase()
    }. ${
    this.authService.currentUser.lastName.substr(0, 1).toUpperCase()
    }.`;
  @Input() withDateControl: string;
  @Input() withTimeControl: string;

  @Output() fieldSigned: EventEmitter<boolean> = new EventEmitter<boolean>();

  private signButtonEl: HTMLElement;

  constructor(
    private el: ElementRef,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private ngControl: NgControl,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) {
  }

  get signatureControl() {
    return this.ngControl.control;
  }

  get dateControl() {
    return this.ngControl.control.parent.get(this.withDateControl);
  }

  get timeControl() {
    return this.ngControl.control.parent.get(this.withTimeControl);
  }

  ngOnInit() {
    if (!this.signatureControl.disabled) {
      this.renderer.addClass(this.el.nativeElement, 'sign-input');

      if (this.withDateControl) {
        this.dateControl.disable({emitEvent: false, onlySelf: true});
      }

      if (this.withTimeControl) {
        this.timeControl.disable({emitEvent: false, onlySelf: true});
      }
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
    this.renderer.listen(this.signButtonEl, 'click', () => this.checkRootParent(this.signatureControl.parent));

    this.setButtonStyles();
  }

  private removeSignButton() {
    this.renderer.removeClass(this.signButtonEl, 'sign-button');
    this.renderer.removeChild(this.el.nativeElement.parentNode, this.signButtonEl);
    this.signButtonEl = null;
  }

  private checkRootParent(parent: AbstractControl) {
    if (parent && parent.parent) {
      this.checkRootParent(parent.parent);
    } else {
      // now parent is root form
      if (parent.valid) {
        this.signField();
      } else {
        this.snackbar.open(`Can't sign. Please, fill all required fields`);
        this.fieldSigned.emit(false);
      }
    }
  }

  private signField() {
    setTimeout(() => {
      this.signatureControl.patchValue(this[this.mode]);
      this.signatureControl.disable();

      if (this.withDateControl) {
        setTimeout(() => {
          this.dateControl.patchValue(this.datePipe.transform(new Date().getTime(), 'yyyy-MM-dd'));
          this.dateControl.disable();
        }, 200);
      }

      if (this.withTimeControl) {
        setTimeout(() => {
          this.timeControl.patchValue(this.datePipe.transform(new Date().getTime(), 'hh:mm'));
          this.timeControl.disable();
        }, 200);
      }

      this.renderer.addClass(this.el.nativeElement, 'signed');

      this.removeSignButton();

      this.fieldSigned.emit(true);
    }, 300);
  }

  private setButtonStyles() {
    const signField = this.el.nativeElement;

    this.renderer.setStyle(this.signButtonEl, 'margin-top', signField.offsetHeight + 'px');
    this.renderer.setStyle(this.signButtonEl, 'left', signField.offsetLeft + 'px');

    this.renderer.addClass(this.signButtonEl, 'sign-button');
  }

}
