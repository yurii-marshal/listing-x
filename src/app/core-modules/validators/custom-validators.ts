import * as _ from 'lodash';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
      return null;
    }
    return _.trim(password.value) === _.trim(confirmPassword.value) ? null : { passwords: true };
  }

  static number(control: AbstractControl): ValidationErrors | null  {
      if (!control.value) {
        return null;  // don't validate empty values to allow optional controls
      }
      const value = +control.value; // convert string to number
      return isNaN(value) ? {'number': true} : null;
    };
}
