import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {HomeModule} from "./home/home.module";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    StoreModule.forRoot([]),
    EffectsModule.forRoot([]),
    HomeModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
