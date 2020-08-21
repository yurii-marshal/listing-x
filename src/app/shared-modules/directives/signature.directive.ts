import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core-modules/core-services/auth.service';
import { MatSnackBar } from '@angular/material';
import { OfferService } from '../../feature-modules/portal/services/offer.service';

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
  @Input() withAmpmControl: string;

  @Output() fieldSigned: EventEmitter<boolean> = new EventEmitter<boolean>();

  private signButtonEl: HTMLElement;

  constructor(
    private el: ElementRef,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private ngControl: NgControl,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private offerService: OfferService,
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

  get ampmControl() {
    return this.ngControl.control.parent.get(this.withAmpmControl);
  }

  ngOnInit() {
    // 2 - set class-marker if a field is allowed for current user
    if (!this.signatureControl.disabled) {
      this.renderer.addClass(this.el.nativeElement, 'sign-input');
      this.offerService.activeSignControls.push(this.signatureControl);

      if (this.withDateControl) {
        this.offerService.activeSignControls.push(this.dateControl);
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
      if (this.withDateControl) {
        setTimeout(() => {
          this.dateControl.patchValue(this.datePipe.transform(new Date().getTime(), 'yyyy-MM-dd'));
        }, 200);
      }

      if (this.withTimeControl) {
        setTimeout(() => {
          this.timeControl.patchValue(this.datePipe.transform(new Date().getTime(), 'hh:mm'));
        }, 200);
      }

      if (this.withAmpmControl) {
        setTimeout(() => {
          this.ampmControl.patchValue(new Date().getHours() > 12 ? 'pm' : 'am');
        }, 200);
      }

      this.signatureControl.patchValue(this[this.mode]);
      this.signatureControl.disable();

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
