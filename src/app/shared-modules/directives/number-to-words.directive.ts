import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appNumberToWords]'
})
export class NumberToWordsDirective implements OnInit, OnDestroy {
  @Input() recipientControlName: string;
  @Input() numToWordsForm: FormGroup;

  private onDestroyed$: Subject<void> = new Subject<void>();

  private NUMBER_MAP = {
    '.': 'point',
    '-': 'negative',
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    10: 'ten',
    11: 'eleven',
    12: 'twelve',
    13: 'thirteen',
    14: 'fourteen',
    15: 'fifteen',
    16: 'sixteen',
    17: 'seventeen',
    18: 'eighteen',
    19: 'nineteen',
    20: 'twenty',
    30: 'thirty',
    40: 'forty',
    50: 'fifty',
    60: 'sixty',
    70: 'seventy',
    80: 'eighty',
    90: 'ninety'
  };

  // http://en.wikipedia.org/wiki/English_numerals#Cardinal_numbers
  private CARDINAL_MAP = {
    2: 'hundred',
    3: 'thousand',
    6: 'million',
    9: 'billion',
    12: 'trillion',
    15: 'quadrillion',
    18: 'quintillion',
    21: 'sextillion',
    24: 'septillion',
    27: 'octillion',
    30: 'nonillion',
    33: 'decillion',
    36: 'undecillion',
    39: 'duodecillion',
    42: 'tredecillion',
    45: 'quattuordecillion',
    48: 'quindecillion',
    51: 'sexdecillion',
    54: 'septendecillion',
    57: 'octodecillion',
    60: 'novemdecillion',
    63: 'vigintillion',
    100: 'googol',
    303: 'centillion'
  };

  // Make a hash of words back to their numeric value.
  private WORD_MAP = {
    nil: 0,
    naught: 0,
    period: '.',
    decimal: '.'
  };

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    fromEvent(this.el.nativeElement, 'input')
      .pipe(
        takeUntil(this.onDestroyed$),
        debounceTime(300)
      )
      .subscribe(({target}) => {
        const converted = this.getInWords(target.value);
        this.numToWordsForm.get(this.recipientControlName).patchValue(converted);
      });

    Object.keys(this.NUMBER_MAP).forEach((num) => {
      this.WORD_MAP[this.NUMBER_MAP[num]] = isNaN(+num) ? num : +num;
    });

    Object.keys(this.CARDINAL_MAP).forEach((num) => {
      this.WORD_MAP[this.CARDINAL_MAP[num]] = isNaN(+num) ? num : Math.pow(10, +num);
    });
  }

  /**
   * Calculate the value of the current stack.
   */
  totalStack(stack, largest) {
    const total = stack.reduceRight((prev, num, index) => {
      if (num > stack[index + 1]) {
        return prev * num;
      }

      return prev + num;
    }, 0);

    return total * largest;
  }

  /**
   * Turn a number into a string representation.
   */
  stringify(value) {
    const num = Number(value);
    const floor = Math.floor(num);

    // If the number is in the numbers object, we quickly return.
    if (this.NUMBER_MAP[num]) {
      return this.NUMBER_MAP[num];
    }

    // If the number is a negative value.
    if (num < 0) {
      return this.NUMBER_MAP['-'] + ' ' + this.stringify(-num);
    }

    // Check if we have decimals.
    if (floor !== num) {
      const words = [this.stringify(floor), this.NUMBER_MAP['.']];
      const chars = String(num).split('.').pop();

      for (const item of chars) {
        words.push(this.stringify(+item));
      }

      return words.join(' ');
    }

    let interval = this.intervals(num);

    // It's below one hundred, but greater than nine.
    if (interval === 1) {
      return this.NUMBER_MAP[Math.floor(num / 10) * 10] + '-' + this.stringify(Math.floor(num % 10));
    }

    const sentence = [];

    // Simple check to find the closest full number helper.
    while (!this.CARDINAL_MAP[interval]) {
      interval -= 1;
    }

    if (this.CARDINAL_MAP[interval]) {
      const remaining = Math.floor(num % Math.pow(10, interval));

      sentence.push(this.stringify(Math.floor(num / Math.pow(10, interval))));
      sentence.push(this.CARDINAL_MAP[interval] + (remaining > 99 ? ',' : ''));

      if (remaining) {
        if (remaining < 100) {
          sentence.push('and');
        }

        sentence.push(this.stringify(remaining));
      }
    }

    return sentence.join(' ');
  }

  /**
   * Turns a string representation of a number into a number type
   */
  parse(num) {
    let modifier = 1;
    let largest = 0;
    let largestInterval = 0;
    let zeros = 0; // Track leading zeros in a decimal.
    let stack = [];

    const total = num.split(/\W+/g)
      .map((word) => {
        const wlc = word.toLowerCase();

        return this.WORD_MAP[wlc] !== undefined ? this.WORD_MAP[wlc] : wlc;
      })
      .filter((wlc) => {
        if (wlc === '-') {
          modifier = -1;
        }
        if (wlc === '.') {
          return true;
        } // Decimal points are a special case.

        return typeof wlc === 'number';
      })
      .reduceRight((memo, numb) => {
        const interval = this.intervals(numb);

        // Check the interval is smaller than the largest one, then create a stack.
        if (typeof numb === 'number' && interval < largestInterval) {
          stack.push(numb);

          if (stack.length === 1) {
            return memo - largest;
          }

          return memo;
        }

        memo += this.totalStack(stack, largest);
        stack = []; // Reset the stack for more computations.

        // If the number is a decimal, transform everything we have worked with.
        if (num === '.') {
          const decimals = zeros + String(memo).length;

          zeros = 0;
          largest = 0;
          largestInterval = 0;

          return memo * Math.pow(10, -decimals);
        }

        // Buffer encountered zeros.
        if (num === 0) {
          zeros += 1;
          return memo;
        }

        // Shove the number on the front if the intervals match and the number whole.
        if (memo >= 1 && interval === largestInterval) {
          let output = '';

          while (zeros > 0) {
            zeros -= 1;
            output += '0';
          }

          return Number(String(num) + output + String(memo));
        }

        largest = num;
        largestInterval = this.intervals(largest);

        return (memo + num) * Math.pow(10, zeros);
      }, 0);

    return modifier * (total + this.totalStack(stack, largest));
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  private getInWords(num: any): string {
    return num ? (+num ? this.stringify(num) : 'NOT A NUMBER') : '';
  }

  /**
   * Returns the number of significant figures for the number.
   */
  private intervals(num): number {
    const match = String(num).match(/e\+(\d+)/);

    if (match) {
      return +match[1];
    }

    return String(num).length - 1;
  }
}
