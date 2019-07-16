import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WriteAnonymousOfferComponent } from './write-anonymous-offer/write-anonymous-offer.component';

const routes: Routes = [
  {
    path: ':token',
    component: WriteAnonymousOfferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousRoutingModule { }
