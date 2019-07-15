import * as _ from 'lodash';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
      return null;
    }
    return _.trim(password.value) === _.trim(confirmPassword.value) ? null : {passwords: true};
  }

  static number(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;  // don't validate empty values to allow optional controls
    }
    const value = Number(control.value);
    return isNaN(value) ? {'number': true} : null;
  };

  static unique = (collection: any[]): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } => {
      return collection.includes(control.value) ? { unique: true } : null;
    };
  };
}
