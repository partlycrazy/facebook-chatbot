import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule }    from '@angular/common/http';
import { ContenteditableModule } from '@ng-stack/contenteditable';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CashbackComponent } from './cashback/cashback.component';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MessageFlowModule } from './message-flows/message-flow.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    CashbackComponent    
  ],
  imports: [
    ContenteditableModule,
    CommonModule,
    BrowserModule,    
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MessageFlowModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
