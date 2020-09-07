import { formatDate } from '@angular/common';
import { NativeDateAdapter } from '@angular/material';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'numeric', day: 'numeric', year: 'numeric'}},
  display: {
    dateInput: 'input',
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};

@Injectable()
export class PickDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    const date = moment(value, 'MM/DD/YYYY');
    return date.isValid() ? date.toDate() : null;
  }

  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MM/dd/yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
