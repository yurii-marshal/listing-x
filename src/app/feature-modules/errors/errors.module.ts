import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { ExpirationLinkComponent } from './expiration-link/expiration-link.component';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    ForbiddenPageComponent,
    ExpirationLinkComponent
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    MatButtonModule
  ]
})
export class ErrorsModule {
}
