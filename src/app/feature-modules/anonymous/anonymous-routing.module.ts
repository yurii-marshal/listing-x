import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WriteAnonymousOfferComponent } from './write-anonymous-offer/write-anonymous-offer.component';
import { AnonymousOfferResolver } from './anonymous-offer.resolver';

const routes: Routes = [
  {
    path: ':token',
    component: WriteAnonymousOfferComponent,
    resolve: {model: AnonymousOfferResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AnonymousOfferResolver]
})
export class AnonymousRoutingModule { }
