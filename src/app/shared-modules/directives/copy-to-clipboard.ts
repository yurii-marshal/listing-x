import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Directive({ selector: '[copy-to-clipboard]' })
export class CopyToClipboard {

  constructor(private snackbar: MatSnackBar) {}

  @Input('copy-to-clipboard')
  public content: string;

  @Output('copied')
  public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {

    event.preventDefault();
    if (!this.content)
      return;

    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window['clipboardData'];
      clipboard.setData('text', this.content.toString());
      e.preventDefault();

      this.copied.emit(this.content);
      this.snackbar.open('Copied!.', 'OK', {duration: 3000})
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }
}
