import { InputManager } from './input.manager';
import { CurrencyMaskConfig, CurrencyMaskInputMode } from './currency-mask.config';

export class InputService {
  PER_AR_NUMBER: Map<string, string> = new Map<string, string>();
  inputManager: InputManager;
  private SINGLE_DIGIT_REGEX: RegExp = new RegExp(/^[0-9\u0660-\u0669\u06F0-\u06F9]$/);
  private ONLY_NUMBERS_REGEX: RegExp = new RegExp(/[^0-9\u0660-\u0669\u06F0-\u06F9]/g);

  constructor(private htmlInputElement: any, private options: CurrencyMaskConfig) {
    this.inputManager = new InputManager(htmlInputElement);
    this.initialize();
  }

  get canInputMoreNumbers(): boolean {
    return this.inputManager.canInputMoreNumbers;
  }

  get inputSelection(): any {
    return this.inputManager.inputSelection;
  }

  get rawValue(): string {
    return this.inputManager.rawValue;
  }

  set rawValue(value: string) {
    this.inputManager.rawValue = value;
  }

  get storedRawValue(): string {
    return this.inputManager.storedRawValue;
  }

  get value(): number {
    return this.clearMask(this.rawValue);
  }

  set value(value: number) {
    this.rawValue = this.applyMask(true, '' + value);
  }

  initialize() {
    this.PER_AR_NUMBER.set('\u06F0', '0');
    this.PER_AR_NUMBER.set('\u06F1', '1');
    this.PER_AR_NUMBER.set('\u06F2', '2');
    this.PER_AR_NUMBER.set('\u06F3', '3');
    this.PER_AR_NUMBER.set('\u06F4', '4');
    this.PER_AR_NUMBER.set('\u06F5', '5');
    this.PER_AR_NUMBER.set('\u06F6', '6');
    this.PER_AR_NUMBER.set('\u06F7', '7');
    this.PER_AR_NUMBER.set('\u06F8', '8');
    this.PER_AR_NUMBER.set('\u06F9', '9');

    this.PER_AR_NUMBER.set('\u0660', '0');
    this.PER_AR_NUMBER.set('\u0661', '1');
    this.PER_AR_NUMBER.set('\u0662', '2');
    this.PER_AR_NUMBER.set('\u0663', '3');
    this.PER_AR_NUMBER.set('\u0664', '4');
    this.PER_AR_NUMBER.set('\u0665', '5');
    this.PER_AR_NUMBER.set('\u0666', '6');
    this.PER_AR_NUMBER.set('\u0667', '7');
    this.PER_AR_NUMBER.set('\u0668', '8');
    this.PER_AR_NUMBER.set('\u0669', '9');
  }

  addNumber(keyCode: number): void {
    const {decimal, precision, inputMode} = this.options;
    const keyChar = String.fromCharCode(keyCode);
    const isDecimalChar = keyChar === this.options.decimal;

    if (!this.rawValue) {
      this.rawValue = this.applyMask(false, keyChar);
      let selectionStart: number;
      if (inputMode === CurrencyMaskInputMode.NATURAL && precision > 0) {
        selectionStart = this.rawValue.indexOf(decimal);
        if (isDecimalChar) {
          selectionStart++;
        }
      }
      this.updateFieldValue(selectionStart);
    } else {
      const selectionStart = this.inputSelection.selectionStart;
      const selectionEnd = this.inputSelection.selectionEnd;
      const rawValueStart = this.rawValue.substring(0, selectionStart);
      let rawValueEnd = this.rawValue.substring(selectionEnd, this.rawValue.length);

      // In natural mode, replace decimals instead of shifting them.
      const inDecimalPortion = rawValueStart.indexOf(decimal) !== -1;
      if (inputMode === CurrencyMaskInputMode.NATURAL && inDecimalPortion && selectionStart === selectionEnd) {
        rawValueEnd = rawValueEnd.substring(1);
      }

      const newValue = rawValueStart + keyChar + rawValueEnd;
      let nextSelectionStart = selectionStart + 1;
      const isDecimalOrThousands = isDecimalChar || keyChar === this.options.thousands;
      if (isDecimalOrThousands && keyChar === rawValueEnd[0]) {
        // If the cursor is just before the decimal or thousands separator and the user types the
        // decimal or thousands separator, move the cursor past it.
        nextSelectionStart++;
      } else if (!this.SINGLE_DIGIT_REGEX.test(keyChar)) {
        // Ignore other non-numbers.
        return;
      }

      this.rawValue = newValue;
      this.updateFieldValue(nextSelectionStart);
    }
  }

  applyMask(isNumber: boolean, rawValue: string, disablePadAndTrim = false): string {
    const {allowZero, allowNegative, decimal, precision, prefix, suffix, thousands, min, max, inputMode} = this.options;

    rawValue = isNumber ? (+rawValue).toFixed(precision) : rawValue;
    let onlyNumbers = rawValue.replace(this.ONLY_NUMBERS_REGEX, '');

    if (!onlyNumbers && rawValue !== decimal) {
      return '';
    }

    if (inputMode === CurrencyMaskInputMode.NATURAL && !isNumber && !disablePadAndTrim) {
      rawValue = this.padOrTrimPrecision(rawValue);
      onlyNumbers = rawValue.replace(this.ONLY_NUMBERS_REGEX, '');
    }

    let integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision)
      .replace(/^\u0660*/g, '')
      .replace(/^\u06F0*/g, '')
      .replace(/^0*/g, '');

    if (integerPart === '') {
      integerPart = '0';
    }
    const integerValue = parseInt(integerPart, 10);

    integerPart = integerPart.replace(/\B(?=([0-9\u0660-\u0669\u06F0-\u06F9]{3})+(?![0-9\u0660-\u0669\u06F0-\u06F9]))/g, thousands);
    if (thousands && integerPart.startsWith(thousands)) {
      integerPart = integerPart.substring(1);
    }

    let newRawValue = integerPart;
    const decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);
    const decimalValue = parseInt(decimalPart, 10) || 0;

    const isNegative = rawValue.indexOf('-') > -1;

    // Ensure max is at least as large as min.
    const currentMax = (this.isNullOrUndefined(max) || this.isNullOrUndefined(min)) ? max : Math.max(max, min);

    // Restrict to the min and max values.
    let newValue = integerValue + (decimalValue / 100);
    newValue = isNegative ? -newValue : newValue;
    if (!this.isNullOrUndefined(currentMax) && newValue > currentMax) {
      return this.applyMask(true, currentMax + '');
    } else if (!this.isNullOrUndefined(min) && newValue < min) {
      return this.applyMask(true, min + '');
    }

    if (precision > 0) {
      if (newRawValue === '0' && decimalPart.length < precision) {
        newRawValue += decimal + '0'.repeat(precision - 1) + decimalPart;
      } else {
        newRawValue += decimal + decimalPart;
      }
    }

    const isZero = newValue === 0;
    const operator = (isNegative && allowNegative && !isZero) ? '-' : '';
    return operator + prefix + newRawValue + suffix;
  }

  padOrTrimPrecision(rawValue: string): string {
    const {decimal, precision} = this.options;

    let decimalIndex = rawValue.lastIndexOf(decimal);
    if (decimalIndex === -1) {
      decimalIndex = rawValue.length;
      rawValue += decimal;
    }

    let decimalPortion = rawValue.substring(decimalIndex).replace(this.ONLY_NUMBERS_REGEX, '');
    const actualPrecision = decimalPortion.length;
    if (actualPrecision < precision) {
      for (let i = actualPrecision; i < precision; i++) {
        decimalPortion += '0';
      }
    } else if (actualPrecision > precision) {
      decimalPortion = decimalPortion.substring(0, decimalPortion.length + precision - actualPrecision);
    }

    return rawValue.substring(0, decimalIndex) + decimal + decimalPortion;
  }

  clearMask(rawValue: string): number {
    if (this.isNullable() && rawValue === '') {
      return null;
    }

    let value = (rawValue || '0').replace(this.options.prefix, '').replace(this.options.suffix, '');

    if (this.options.thousands) {
      value = value.replace(new RegExp('\\' + this.options.thousands, 'g'), '');
    }

    if (this.options.decimal) {
      value = value.replace(this.options.decimal, '.');
    }

    this.PER_AR_NUMBER.forEach((val: string, key: string) => {
      const re = new RegExp(key, 'g');
      value = value.replace(re, val);
    });
    return parseFloat(value);
  }

  changeToNegative(): void {
    if (this.options.allowNegative && this.rawValue !== '' && this.rawValue.charAt(0) !== '-' && this.value !== 0) {
      // Apply the mask to ensure the min and max values are enforced.
      this.rawValue = this.applyMask(false, '-' + this.rawValue);
    }
  }

  changeToPositive(): void {
    // Apply the mask to ensure the min and max values are enforced.
    this.rawValue = this.applyMask(false, this.rawValue.replace('-', ''));
  }

  removeNumber(keyCode: number): void {
    const {decimal, thousands, prefix, suffix, inputMode} = this.options;

    console.log(this.value);
    if (this.isNullable() && this.value === 0) {
      this.rawValue = null;
      return;
    }

    let selectionEnd = this.inputSelection.selectionEnd;
    let selectionStart = this.inputSelection.selectionStart;

    const suffixStart = this.rawValue.length - suffix.length;
    selectionEnd = Math.min(suffixStart, Math.max(selectionEnd, prefix.length));
    selectionStart = Math.min(suffixStart, Math.max(selectionStart, prefix.length));

    // Check if selection was entirely in the prefix or suffix.
    if (selectionStart === selectionEnd &&
      this.inputSelection.selectionStart !== this.inputSelection.selectionEnd) {
      this.updateFieldValue(selectionStart);
      return;
    }

    let decimalIndex = this.rawValue.indexOf(decimal);
    if (decimalIndex === -1) {
      decimalIndex = this.rawValue.length;
    }

    let shiftSelection = 0;
    let insertChars = '';
    if (selectionEnd === selectionStart) {
      if (keyCode === 8) {
        if (selectionStart <= prefix.length) {
          return;
        }
        selectionStart--;

        // If previous char isn't a number, go back one more.
        if (!this.rawValue.substr(selectionStart, 1).match(/\d/)) {
          selectionStart--;
        }

        // In natural mode, jump backwards when in decimal portion of number.
        if (inputMode === CurrencyMaskInputMode.NATURAL && decimalIndex < selectionEnd) {
          shiftSelection = -1;
        }
      } else if (keyCode === 46 || keyCode === 63272) {
        if (selectionStart === suffixStart) {
          return;
        }
        selectionEnd++;

        // If next char isn't a number, go one more.
        if (!this.rawValue.substr(selectionStart, 1).match(/\d/)) {
          selectionStart++;
          selectionEnd++;
        }
      }
    }

    // In natural mode, replace decimals with 0s.
    if (inputMode === CurrencyMaskInputMode.NATURAL && selectionStart > decimalIndex) {
      const replacedDecimalCount = selectionEnd - selectionStart;
      for (let i = 0; i < replacedDecimalCount; i++) {
        insertChars += '0';
      }
    }

    let selectionFromEnd = this.rawValue.length - selectionEnd;
    this.rawValue = this.rawValue.substring(0, selectionStart) + insertChars + this.rawValue.substring(selectionEnd);

    // Remove leading thousand separator from raw value.
    const startChar = this.rawValue.substr(prefix.length, 1);
    if (startChar === thousands) {
      this.rawValue = this.rawValue.substring(0, prefix.length) + this.rawValue.substring(prefix.length + 1);
      selectionFromEnd = Math.min(selectionFromEnd, this.rawValue.length - prefix.length);
    }

    this.updateFieldValue(this.rawValue.length - selectionFromEnd + shiftSelection, true);
  }

  updateFieldValue(selectionStart?: number, disablePadAndTrim = false): void {
    const newRawValue = this.applyMask(false, this.rawValue || '', disablePadAndTrim);
    selectionStart = selectionStart === undefined ? this.rawValue.length : selectionStart;
    selectionStart = Math.max(this.options.prefix.length, Math.min(selectionStart, this.rawValue.length - this.options.suffix.length));
    this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
  }

  updateOptions(options: any): void {
    const value: number = this.value;
    this.options = options;
    this.value = value;
  }

  prefixLength(): any {
    return this.options.prefix.length;
  }

  suffixLength(): any {
    return this.options.suffix.length;
  }

  isNullable() {
    return this.options.nullable;
  }

  private isNullOrUndefined(value: any) {
    return value === null || value === undefined;
  }
}
