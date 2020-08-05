import {
  BACKSPACE,
  DELETE,
  LEFT_ARROW,
  NINE,
  NUMPAD_NINE,
  NUMPAD_ZERO,
  RIGHT_ARROW,
  TAB,
  ZERO,
} from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Renderer2,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor, FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[timeMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeFormatDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeFormatDirective),
      multi: true,
    },
  ],
})
export class TimeFormatDirective implements ControlValueAccessor, Validator {
  _onChange: (_: string) => void;

  _touched: () => void;

  private _fieldJustGotFocus = false;

  constructor(
    @Self() private _el: ElementRef,
    private _renderer: Renderer2,
  ) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(evt: KeyboardEvent) {

    const keyCode = evt.keyCode;
    switch (keyCode) {
      case LEFT_ARROW:
      case RIGHT_ARROW:
      case TAB:
        this._decideWhetherToJumpAndSelect(keyCode, evt);
        break;

      case DELETE:
      case BACKSPACE:
        this._clearHoursOrMinutes();
        break;

      default:
        if ((keyCode >= ZERO && keyCode <= NINE) ||
          (keyCode >= NUMPAD_ZERO && keyCode <= NUMPAD_NINE)) {
          this._setInputText(evt.key);
        }
    }

    if (keyCode !== TAB) {
      evt.preventDefault();
    }
  }

  @HostListener('click', ['$event'])
  onClick(evt: MouseEvent) {
    this._fieldJustGotFocus = true;
    const caretPosition = this._doGetCaretPosition();
    if (caretPosition < 3) {
      this._el.nativeElement.setSelectionRange(0, 2);
    } else {
      this._el.nativeElement.setSelectionRange(3, 6);
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(evt: any) {
    this._fieldJustGotFocus = true;
    const caretPosition = this._doGetCaretPosition();
    if (caretPosition < 3) {
      this._el.nativeElement.setSelectionRange(0, 2);
    } else {
      this._el.nativeElement.setSelectionRange(3, 6);
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(evt: any) {
    this._touched();
  }

  _clearHoursOrMinutes() {
    const caretPosition = this._doGetCaretPosition();
    const input: string[] = this._el.nativeElement.value.split(':');

    const hours: string = input[0];
    const minutes: string = input[1];

    let newTime = '';
    let sendCaretToMinutes = false;

    if (caretPosition > 2) {
      newTime = `${hours}:00`;
      sendCaretToMinutes = true;
    } else {
      newTime = `00:${minutes}`;
      sendCaretToMinutes = false;
    }

    this._fieldJustGotFocus = true;

    this._renderer.setProperty(this._el.nativeElement, 'value', newTime);
    this._controlValueChanged();
    if (!sendCaretToMinutes) {
      this._el.nativeElement.setSelectionRange(0, 2);
    } else {
      this._el.nativeElement.setSelectionRange(3, 6);
    }
  }

  writeValue(value: string): void {
    const v = value ? value.substr(0, 5) : '00:00';

    this._renderer.setProperty(this._el.nativeElement, 'value', v);
  }

  registerOnChange(fn: (_: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._touched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
  }

  validate(c: FormControl): { [key: string]: any } {
    return this._el.nativeElement.value.indexOf('-') === -1 ? null : {validTime: false};
  }

  private _decideWhetherToJumpAndSelect(keyCode: number, evt?: KeyboardEvent) {

    const caretPosition = this._doGetCaretPosition();

    switch (keyCode) {
      case RIGHT_ARROW:
        this._el.nativeElement.setSelectionRange(3, 6);
        break;

      case LEFT_ARROW:
        this._el.nativeElement.setSelectionRange(0, 2);
        break;

      case TAB:
        if (caretPosition < 2 && !evt.shiftKey) {
          this._el.nativeElement.setSelectionRange(3, 6);
          evt.preventDefault();
        } else if (caretPosition > 2 && evt.shiftKey) {
          this._el.nativeElement.setSelectionRange(0, 2);
          evt.preventDefault();
        }
    }

    this._fieldJustGotFocus = true;
  }

  private _setInputText(key: string) {
    const input: string[] = this._el.nativeElement.value.split(':');

    const hours: string = input[0];
    const minutes: string = input[1];

    const caretPosition = this._doGetCaretPosition();
    if (caretPosition < 3) {
      this._setHours(hours, minutes, key);
    } else {
      this._setMinutes(hours, minutes, key);
    }

    this._fieldJustGotFocus = false;
  }

  private _setHours(hours: string, minutes: string, key) {
    const hoursArray: string[] = hours.split('');
    const secondDigit: string = hoursArray[1];

    let newHour = '';

    let sendCaretToMinutes = false;

    if (this._fieldJustGotFocus) {
      newHour = `0${key}`;
      sendCaretToMinutes = Number(key) > 2;
    } else {
      newHour = `${secondDigit}${key}`;
      if (Number(newHour) > 12) {
        newHour = '12';
      }
      sendCaretToMinutes = true;
    }

    const completeTime = `${newHour}:${minutes}`;

    this._renderer.setProperty(this._el.nativeElement, 'value', completeTime);
    this._controlValueChanged();
    if (!sendCaretToMinutes) {
      this._el.nativeElement.setSelectionRange(0, 2);
    } else {
      this._el.nativeElement.setSelectionRange(3, 6);
      this._fieldJustGotFocus = true;
    }
  }

  private _setMinutes(hours: string, minutes: string, key) {
    const minutesArray: string[] = minutes.split('');
    const secondDigit: string = minutesArray[1];

    let newMinutes = '';

    if (this._fieldJustGotFocus) {
      newMinutes = `0${key}`;
    } else {
      if (Number(minutes) === 59) {
        newMinutes = `0${key}`;
      } else {
        newMinutes = `${secondDigit}${key}`;
        if (Number(newMinutes) > 59) {
          newMinutes = '59';
        }
      }
    }

    const completeTime = `${hours}:${newMinutes}`;

    this._renderer.setProperty(this._el.nativeElement, 'value', completeTime);
    this._controlValueChanged();
    this._el.nativeElement.setSelectionRange(3, 6);
  }

  /*
  ** Returns the caret (cursor) position of the specified text field.
  ** Return value range is 0-nativeElement.value.length.
  */
  private _doGetCaretPosition(): number {

    // Initialize
    let iCaretPos = 0;

    const nativeElement = this._el.nativeElement;

    // IE Support
    if (document.hasOwnProperty('selection')) {

      // Set focus on the element
      nativeElement.focus();

      // To get cursor position, get empty selection range
      const oSel = document['selection'].createRange();

      // Move selection start to 0 position
      oSel.moveStart('character', -nativeElement.value.length);

      // The caret position is selection length
      iCaretPos = oSel.text.length;
    } else if (nativeElement.selectionStart || nativeElement.selectionStart === '0') {
      // Firefox support
      iCaretPos = nativeElement.selectionStart;
    }

    // Return results
    return iCaretPos;
  }

  /** Set the NgControl and local value  */
  private _controlValueChanged() {
    this._onChange(this._el.nativeElement.value);
  }

}
