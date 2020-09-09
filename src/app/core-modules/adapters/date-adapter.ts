import { formatDate } from '@angular/common';
import { NativeDateAdapter } from '@angular/material';
import { Injectable } from '@angular/core';

export const PICK_FORMATS = {
  parse: {dateInput: 'MM/DD/YYYY'},
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
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const dayArray = str[2].split('T');

      const year = Number(str[0]);
      const month = Number(str[1]) - 1;
      const day = Number(dayArray[0]);

      return new Date(year, month, day);
    }

    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'MM/dd/yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
