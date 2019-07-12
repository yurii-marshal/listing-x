import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Directive({selector: '[copy-to-clipboard]'})
export class CopyToClipboard {

  constructor(private snackbar: MatSnackBar) {
  }

  @Input('copy-to-clipboard')
  public content: string;

  @Output('copied')
  public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {

    event.preventDefault();
    if (!this.content) {
      return;
    }

    this.copyText(this.content);
    this.snackbar.open('Copied.', 'OK', {duration: 3000});
    this.copied.emit(this.content);
  }

  /* To copy any Text */
  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

  }
}
