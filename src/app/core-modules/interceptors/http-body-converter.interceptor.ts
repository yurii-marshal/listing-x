import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class HttpBodyConverterInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!(req.body instanceof FormData)) {
      const pythonObject = this.toPythonCaseKeys(req.body);
      req = req.clone({body: pythonObject});
    }

    return next.handle(req)
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const camelCaseObject = this.toCamelCaseKeys(event.body);
            return event.clone({body: camelCaseObject});
          }
          return event;
        })
      );
  }

  // Convert Python into Angular / Typescript compatible format
  private toCamelCaseKeys(o: any): any {
    return this.mapKeysDeep(o, (v, k) => _.camelCase(k));
  }

  // Convert  Angular / Typescript into Python compatible format
  private toPythonCaseKeys(o: any): any {
    return this.mapKeysDeep(o, (v, k) => _.snakeCase(k));
  }

  private mapKeysDeep(obj, cb) {
    if (_.isArray(obj)) {
      return obj.map(innerObj => this.mapKeysDeep(innerObj, cb)); // recursion
    } else if (_.isObject(obj)) {
      return _.mapValues(
        _.mapKeys(obj, cb), val => this.mapKeysDeep(val, cb), // recursion
      );
    } else {
      return obj;
    }
  }
}
