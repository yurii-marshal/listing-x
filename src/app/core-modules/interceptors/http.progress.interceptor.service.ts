import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProgressService } from '../services/progress.service';

@Injectable({
  providedIn: 'root'
})
export class HttpProgressInterceptor implements HttpInterceptor {

  constructor(private progressService: ProgressService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressService.showProgressBar();
    return next.handle(req)
      .pipe(
        tap(
          (event: HttpEvent<any>) => (event instanceof HttpResponse) && this.progressService.hideProgressBar(),
          err => this.progressService.hideProgressBar()
        )
      );
  }
}
