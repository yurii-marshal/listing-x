import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { bufferTime, distinctUntilChanged, filter, map, scan, share, shareReplay } from 'rxjs/operators';
import * as _ from 'lodash';

export enum ProgressBarState {
  Hide = -1,
  Show = 1
}


@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  /**
   * Globally indicate data processing. Binded in app.component
   * */
  private processingSubject = new Subject<ProgressBarState>();

  /**
   *  Pipeline of async operation to handle global http loading state of app
   * */
  private progressStream: Observable<boolean> = this.processingSubject
    .asObservable()
    .pipe(
      bufferTime(500),
      filter(states => states.length > 0),
      scan((total: number, states: ProgressBarState[]) => total + _.sum(states), 0),
      map((diff: number) => diff !== 0),
      distinctUntilChanged(),
      shareReplay()
    );

  get processingStream(): Observable<boolean> {
    return this.progressStream;
  }

  public showProgressBar(): void {
    this.processingSubject.next(ProgressBarState.Show);
  }

  public hideProgressBar(): void {
    this.processingSubject.next(ProgressBarState.Hide);
  }

}
