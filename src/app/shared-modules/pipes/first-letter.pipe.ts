import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'letter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (typeof value !== 'string') return '';
    return value.charAt(0)
  }

}
