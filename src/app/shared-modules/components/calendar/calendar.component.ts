import { Component, ComponentRef, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent } from '../../../core-modules/models/transaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ViewOptionsInput } from '@fullcalendar/core/types/input-types';
import { FullCalendarComponent } from '@fullcalendar/angular';
import * as moment from 'moment';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TooltipContentComponent } from '../tooltip-content/tooltip-content.component';
import { ComponentPortal } from '@angular/cdk/portal';
import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

export enum CalendarView {
  Month = 'dayGridMonth',
  Week = 'timeGridWeek'
}

@Component({
  selector: 'lis-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input()
  dataSource: CalendarEvent[];

  @Input()
  defaultView: CalendarView = CalendarView.Week;

  calendarHeader = {
    center: 'title',
    left: 'today prev,next',
    right: `${CalendarView.Week},${CalendarView.Month}`
  };

  calendarPlugins = [dayGridPlugin, timeGridPlugin];

  calendarViews: { [viewId: string]: ViewOptionsInput } = {
    dayGrid: {
      columnHeaderFormat: {weekday: 'long'}
    },
    timeGrid: {
      columnHeaderFormat: {weekday: 'long', day: 'numeric'}
    }
  };

  @ViewChild('calendar', {static: false})
  calendarComponent: FullCalendarComponent;

  private overlayRef: OverlayRef;
  private debounceSubject: Subject<string>;
  private debounceSubscription: Subscription;

  constructor(private overlay: Overlay,
              private overlayPositionBuilder: OverlayPositionBuilder,
  ) {
  }

  ngOnInit() {
    this.debounceSubject = new Subject();
    this.debounceSubscription = this.debounceSubject
      .pipe(
        tap(() => this.hidePopover()),
        debounceTime(1000),
      )
      .subscribe(htmlText => this.attachOverlay(htmlText));
  }

  @HostListener('mouseleave', ['$event'])
  onLeave( e: MouseEvent ) {
    this.hidePopover();
  }

  showPopover(eventObj): void {
    const elementRef: ElementRef = eventObj.el as ElementRef;
    const calendarView: CalendarView = eventObj.view.type;
    this.createOrUpdateOverlay(elementRef, calendarView);
    const htmlText = this.formatMessage(eventObj);
    this.debounceSubject.next(htmlText);
  }

  hidePopover(): void {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  private attachOverlay(htmlText: string): void {
    const tooltipRef = this.overlayRef.attach(new ComponentPortal(TooltipContentComponent));
    tooltipRef.instance.text = htmlText;
  }

  private createOrUpdateOverlay(elementRef: ElementRef, calendarView: CalendarView) {
    const offsetY = calendarView === CalendarView.Week ? 50 : 20;
    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(elementRef).withPositions([
      {
        originX:  'center',
        originY:  'top',
        overlayX: 'center',
        overlayY: 'top',
        offsetY:   offsetY,
      }
    ]);

    if (this.overlayRef) {
      this.overlayRef.updatePositionStrategy(positionStrategy);
    } else {
      this.overlayRef = this.overlay.create({positionStrategy});
    }
  }

  private formatMessage(eventObj) {
    const date = _.get(eventObj, 'event.start');
    const title = _.get(eventObj, 'event.title');
    if (date && title) {
      const start = moment(date).format('LLLL');
      return `<strong>${start}</b><br><br><span>${title}</span>`;
    }
    return '';
  }
}
