import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashbackComponent } from "./cashback/cashback.component";
import { FlowComponent } from "./message-flows/flow/flow.component";

const routes: Routes = [
  { path: 'cashback', component: CashbackComponent },
  {
    path: 'flow', 
    component: FlowComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
