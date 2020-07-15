import { Injectable } from '@angular/core';
import numToWords from 'num-to-words';

@Injectable({
  providedIn: 'root'
})
export class NumberToWordsService {
  private defaultParams = {ands: true, commas: true};

  constructor() {
  }

  getInWords(num: any, params = this.defaultParams): string {
    return +num ? numToWords(num, params) : 'Not a number';
  }
}
