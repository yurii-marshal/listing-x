import { Component, Input, ChangeDetectionStrategy, ElementRef, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ol-tooltip-content',
  styleUrls: ['./tooltip-content.component.scss'],
  templateUrl: './tooltip-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('tooltip', [
    transition(':enter', [style({ opacity: 0 }), animate('400ms', style({ opacity: 1 }))]),
    transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
  ]),],
})
export class TooltipContentComponent  {
  @Input()
  text: string;
}
