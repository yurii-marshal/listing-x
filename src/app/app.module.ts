import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './core-modules/interceptors/jwt.interceptor.service';
import { MAT_DATE_LOCALE, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { AuthService } from './core-modules/services/auth.service';
import { HttpErrorsInterceptor } from './core-modules/interceptors/http-errors.interceptor.service';
import { ProgressService } from './core-modules/services/progress.service';
import { HttpProgressInterceptor } from './core-modules/interceptors/http-progress.interceptor.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatProgressBarModule
  ],
  providers: [
    AuthService,
    ProgressService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpProgressInterceptor,
      multi: true,
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptor,
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
