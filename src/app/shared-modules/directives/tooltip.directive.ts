import { ComponentRef, Directive, ElementRef, HostListener, Input, OnInit, } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipContentComponent } from '../components/tooltip-content/tooltip-content.component';

@Directive({ selector: '[tooltip]' })
export class TooltipDirective implements OnInit {
  @Input('tooltip')
  tooltipString: string;

  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(this.elementRef).withPositions([
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 28,
      },
    ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('mouseenter')
  show() {
    const tooltipRef: ComponentRef<TooltipContentComponent> = this.overlayRef.attach(new ComponentPortal(TooltipContentComponent));
    tooltipRef.instance.text = this.tooltipString;
  }

  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
  }
}
