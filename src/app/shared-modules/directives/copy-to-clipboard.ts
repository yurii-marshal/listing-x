import { Directive, Input, Output, EventEmitter, HostListener, ElementRef, OnInit, ComponentRef } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TooltipContentComponent } from '../components/tooltip-content/tooltip-content.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({selector: '[copy-to-clipboard]'})
export class CopyToClipboard  implements OnInit {
  private overlayRef: OverlayRef;

  @Input('copy-to-clipboard')
  public content: string;

  @Output('copied')
  public copied: EventEmitter<string> = new EventEmitter<string>();

  constructor(private overlay: Overlay,
              private overlayPositionBuilder: OverlayPositionBuilder,
              private elementRef: ElementRef,) {
  }


  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(this.elementRef).withPositions([
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 40,
      },
    ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.content) {
      return;
    }

    this.copyText(this.content);
    this.copied.emit(this.content);
    const tooltipRef: ComponentRef<TooltipContentComponent> = this.overlayRef.attach(new ComponentPortal(TooltipContentComponent));
    tooltipRef.instance.text = 'Copied!';
  }


  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
  }

  /* To copy any Text */
  private copyText(val: string) {
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
