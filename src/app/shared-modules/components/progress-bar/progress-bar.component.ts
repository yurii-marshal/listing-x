import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  // required
  @Input() totalFieldsNum: number = 0;
  @Input() completedFieldsCount: number = 0;
  // optional
  @Input() pagesNum: number = 0;
  @Input() completedPageCount: number = 0;
  @Input() currentPage: number;

  constructor() { }

}
