import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {StoreModule, provideStore} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {HomeModule} from "./home/home.module";
import { HttpClientModule } from '@angular/common/http';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([]),
    HomeModule,
    HttpClientModule,
    UserListComponent
  ],
  declarations: [
    AppComponent
  ],
  providers: [provideStore([])],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
