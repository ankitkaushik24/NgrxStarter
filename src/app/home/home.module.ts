import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {HomeComponent} from "./home.component";
import {CommonModule} from "@angular/common";
import { provideState } from "@ngrx/store";
import { UsersEffects, usersReducer } from "./users.store";
import { provideEffects } from "@ngrx/effects";
import { UsersDirective } from "./users.directive";
import { UsersComponent } from "./users.component";
import { UsersDataService } from "./users-data.service";

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        CommonModule,
        UsersDirective
    ],
    declarations: [
        HomeComponent, 
        UsersComponent
    ],
    providers: [
        UsersDataService,
        provideState('users', usersReducer),
        provideEffects([UsersEffects])
    ],
    exports: [
        HomeComponent,
        UsersComponent
    ]
})
export class HomeModule {
}
