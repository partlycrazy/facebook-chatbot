import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlowEditorComponent } from "./flow-editor/flow-editor.component";
import { FlowComponent } from "./flow/flow.component";


const flowRoutes: Routes = [
  { path: 'flows',  component: FlowComponent},
  { path: 'flow-editor/:id', component: FlowEditorComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(flowRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MessageFlowRoutingModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/