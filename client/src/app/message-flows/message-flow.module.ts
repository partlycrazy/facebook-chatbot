import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContenteditableModule } from '@ng-stack/contenteditable';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

import { FlowEditorComponent } from "./flow-editor/flow-editor.component";
import { FlowComponent, ConfirmDeleteDialog } from "./flow/flow.component";

import { MessageFlowRoutingModule } from './message-flow-routing.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ContenteditableModule,
    MessageFlowRoutingModule,
    DragDropModule,
    MatTooltipModule,
    MatInputModule,
    TextFieldModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule
  ],
  declarations: [
    FlowEditorComponent,
    FlowComponent,
    ConfirmDeleteDialog
  ],
  entryComponents: [
    ConfirmDeleteDialog
  ]
})
export class MessageFlowModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/