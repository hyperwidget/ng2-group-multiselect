import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DemoAppComponent } from './app.component';
import { MultiSelectComponent } from "../../src/";

@NgModule({
  declarations: [
    DemoAppComponent,
    MultiSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [DemoAppComponent]
})
export class AppModule { }
