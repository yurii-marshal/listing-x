import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProgressService } from '../core-services/progress.service';

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
        finalize(() => this.progressService.hideProgressBar())
      );
  }
}
