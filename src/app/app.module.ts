import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './core-modules/interceptors/jwt.interceptor';
import { MAT_DATE_LOCALE, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatIconModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { HttpErrorsInterceptor } from './core-modules/interceptors/http-errors.interceptor';
import { HttpProgressInterceptor } from './core-modules/interceptors/http-progress.interceptor';
import { AuthService } from './core-modules/core-services/auth.service';
import { ProgressService } from './core-modules/core-services/progress.service';
import { HttpBodyConverterInterceptor } from './core-modules/interceptors/http-body-converter.interceptor';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from './shared-modules/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    FullCalendarModule,
    SharedModule.forRoot()
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
      provide: HTTP_INTERCEPTORS,
      useClass: HttpBodyConverterInterceptor,
      multi: true,
    },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500, verticalPosition: 'top'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
