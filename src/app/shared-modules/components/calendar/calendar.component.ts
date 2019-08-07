import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent } from '../../../core-modules/models/transaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ViewOptionsInput } from '@fullcalendar/core/types/input-types';
import { FullCalendarComponent } from '@fullcalendar/angular';
import * as moment from 'moment';

@Component({
  selector: 'lis-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input()
  dataSource: CalendarEvent[];

  @Input()
  defaultView: string = 'timeGridWeek';

  calendarHeader = {
    center: 'title',
    left: 'today prev,next',
    right: 'timeGridWeek' //'dayGridMonth,timeGridWeek'
  };

  calendarPlugins = [
    dayGridPlugin, // important!
    timeGridPlugin
  ];

  calendarViews: {[viewId: string]: ViewOptionsInput} = {
    dayGrid: {
      columnHeaderFormat: { weekday: 'long' }
    },
    timeGrid: {
      columnHeaderFormat: { weekday: 'long', day: 'numeric' }
    }
  };

  @ViewChild('calendar', {static: false})
  calendarComponent: FullCalendarComponent;

  constructor() { }

  ngOnInit() {
  }
}
