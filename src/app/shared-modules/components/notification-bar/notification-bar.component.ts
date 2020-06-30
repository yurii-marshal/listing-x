import { Component, Input, OnInit } from '@angular/core';
import { NotificationType } from '../../../core-modules/enums/notification-type';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  @Input() type: string = NotificationType.Notice;

  public noteTypes = NotificationType;

  constructor() {
  }

  ngOnInit() {
  }

}
