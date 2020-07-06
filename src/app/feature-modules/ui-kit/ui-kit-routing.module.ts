import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UiKitPageComponent } from './ui-kit-page/ui-kit-page.component';

const routes: Routes = [
  {
    path: '',
    component: UiKitPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiKitRoutingModule { }
