import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core-modules/core-services/auth.service';
import { MatSnackBar } from '@angular/material';

@Directive({
  selector: '[appSignature]'
})
export class SignatureDirective implements OnInit {
  @Input() mode: 'sign' | 'initials' = 'sign';
  @Input() sign: string = '';
  @Input() initials: string = '';
  @Input() withDateControl: string;
  @Input() withTimeControl: string;
  @Input() withAmpmControl: string;
  @Input() optional: boolean = false;
  @Input() signId: number;

  @Output() fieldSigned: EventEmitter<object> = new EventEmitter<object>();

  isActiveSignRow: boolean;

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

  get ampmControl() {
    return this.ngControl.control.parent.get(this.withAmpmControl);
  }

  @Input() set active(val: boolean) {
    val ? this.renderSignButton() : this.removeSignButton();
  }

  ngOnInit() {
    this.sign = `${this.authService.currentUser.firstName} ${this.authService.currentUser.lastName}`;

    this.initials = `${
      this.authService.currentUser.firstName.substr(0, 1).toUpperCase()
      }. ${
      this.authService.currentUser.lastName.substr(0, 1).toUpperCase()
      }.`;

    this.isActiveSignRow = this.signatureControl.enabled;
  }

  resetData(emit = false) {
    if (this.withDateControl) {
      this.dateControl.patchValue('', {emitEvent: emit, onlySelf: true});
    }

    if (this.withTimeControl) {
      this.timeControl.patchValue('', {emitEvent: emit, onlySelf: true});
    }

    if (this.withAmpmControl) {
      this.ampmControl.patchValue('am', {emitEvent: emit, onlySelf: true});
    }

    this.signatureControl.patchValue('', {emitEvent: emit, onlySelf: true});
  }

  scrollToButton() {
    this.el.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  renderSignButton() {
    this.signButtonEl = this.renderer.createElement('button');

    this.renderer.appendChild(this.signButtonEl, this.renderer.createText('Sign'));
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.signButtonEl);
    this.renderer.listen(this.signButtonEl, 'click', () => this.checkRootParent(this.signatureControl.parent));

    this.setButtonStyles();

    this.signatureControl.disable({onlySelf: true, emitEvent: false});
  }

  private removeSignButton() {
    if (this.signButtonEl) {
      if (this.optional) {
        this.renderer.removeClass(this.signButtonEl, 'optional');
      }
      this.renderer.removeClass(this.signButtonEl, 'sign-button');
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.signButtonEl);
      this.signButtonEl = null;
    }
  }

  private checkRootParent(parent: AbstractControl) {
    if (parent && parent.parent) {
      this.checkRootParent(parent.parent);
    } else {
      // now parent is root form
      if (!parent.invalid && !parent.errors) {
        this.signField();
      } else {
        if (parent.errors.notSignedPA === true) {
          this.snackbar.open(`Please, sign the purchase agreement first`);
        } else {
          this.snackbar.open(`Can't sign. Please, fill all required fields`);
        }

        this.fieldSigned.emit({errors: parent.errors});
      }
    }
  }

  private signField() {
    setTimeout(() => {
      if (this.withDateControl) {
        this.dateControl.patchValue(new Date());
      }

      if (this.withTimeControl) {
        this.timeControl.patchValue(this.datePipe.transform(new Date().getTime(), 'hh:mm'));
      }

      if (this.withAmpmControl) {
        this.ampmControl.patchValue(new Date().getHours() > 12 ? 'pm' : 'am');
      }

      this.signatureControl.patchValue(this[this.mode]);
      this.signatureControl.disable();

      this.renderer.addClass(this.el.nativeElement, 'signed');

      this.removeSignButton();

      this.fieldSigned.emit({id: this.signId});
    }, 300);
  }

  private setButtonStyles() {
    const signField = this.el.nativeElement;

    this.renderer.setStyle(this.signButtonEl, 'margin-top', signField.offsetHeight + 'px');
    this.renderer.setStyle(this.signButtonEl, 'left', signField.offsetLeft + 'px');

    this.renderer.addClass(this.signButtonEl, 'sign-button');

    if (this.optional) {
      this.renderer.addClass(this.signButtonEl, 'optional');
    }
  }

}
