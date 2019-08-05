import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent } from '../../../core-modules/models/transaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ViewOptionsInput } from '@fullcalendar/core/types/input-types';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'lis-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input()
  dataSource: CalendarEvent[];

  calendarHeader = {
    center: 'title',
    left: 'today prev,next',
    right: 'dayGridMonth,timeGridWeek'
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
