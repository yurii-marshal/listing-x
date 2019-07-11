import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WriteOfferComponent } from './write-offer/write-offer.component';

const routes: Routes = [
  {
    path: ':token',
    component: WriteOfferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousRoutingModule { }
