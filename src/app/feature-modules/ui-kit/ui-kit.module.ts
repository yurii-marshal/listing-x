import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiKitRoutingModule } from './ui-kit-routing.module';
import { UiKitPageComponent } from './ui-kit-page/ui-kit-page.component';

@NgModule({
  declarations: [UiKitPageComponent],
  imports: [
    CommonModule,
    UiKitRoutingModule
  ]
})
export class UiKitModule { }
