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
    this.snackbar.open('Copied!.', 'OK', {duration: 3000});
/*    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window['clipboardData'];
      clipboard.setData('text', this.content.toString());
      e.preventDefault();

      this.copied.emit(this.content);
      this.snackbar.open('Copied!.', 'OK', {duration: 3000})
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);*/
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
