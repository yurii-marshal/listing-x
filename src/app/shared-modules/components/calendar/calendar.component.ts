import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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

export enum CalendarView {
  Month = 'dayGridMonth',
  Week = 'timeGridWeek'
}

@Component({
  selector: 'lis-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent  {
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

  constructor(private overlay: Overlay,
              private overlayPositionBuilder: OverlayPositionBuilder,
  ) {
  }


  showPopover(eventObj) {
    const elementRef: ElementRef = eventObj.el;
    const offsetY = eventObj.view.type === CalendarView.Week ? 50 : 20;
    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(elementRef).withPositions([
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: offsetY,
      }
    ]);
    this.overlayRef = this.overlay.create({positionStrategy});
    const htmlText = this.formatMessage(eventObj);
    const tooltipRef = this.overlayRef.attach(new ComponentPortal(TooltipContentComponent));
    tooltipRef.instance.text = htmlText;

  }

  private formatMessage(eventObj) {
    const start = moment(eventObj.event.start).format('LLLL');
    const title = _.get(eventObj, 'event.title', '');
    return `<strong>${start}</b><br><br><span>${title}</span>`;
  }

  hidePopover() {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
