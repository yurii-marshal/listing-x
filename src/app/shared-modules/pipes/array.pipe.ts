import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'array'
})
export class ArrayPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (_.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  }

}
