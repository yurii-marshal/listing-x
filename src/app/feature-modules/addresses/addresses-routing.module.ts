import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressesListComponent } from './addresses-list/addresses-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AddressesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressesRoutingModule { }
