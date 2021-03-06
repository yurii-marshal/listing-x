import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgressService } from './core-modules/core-services/progress.service';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showProgressBar: Observable<boolean>;

  constructor(private progressService: ProgressService,
              private matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias ('fontawesome', 'fa');
  }

  ngOnInit(): void {
    this.showProgressBar = this.progressService.processingStream;
  }
}
