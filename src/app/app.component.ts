import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgressService } from './core-modules/services/progress.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showProgressBar: Observable<boolean>;

  constructor(private progressService: ProgressService) {
  }

  ngOnInit(): void {
    this.showProgressBar = this.progressService.processingStream;
  }
}
