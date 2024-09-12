import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { HomeService } from "./home.service";
import { IUser } from "./users.model";
import { UsersServiceState } from "./users.service.state";
import { UsersDataService } from "./users-data.service";
import { UsersDirective } from "./users.directive";



@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // HomeService,
    UsersServiceState
  ]
})
export class HomeComponent extends UsersDirective {
  // homeService = inject(HomeService);
  usersService = inject(UsersServiceState);

  // users$ = this.homeService.users$;
  users$ = this.usersService.users$;

  override onSave(user: IUser) {
    const payload = { ...user, ...this.updatedData[user.id] };
    console.log(payload);

    this.edits.delete(user.id);

    // this.homeService.save$$.next({
    //   payload, afterEffect: (res) => {
    //     // this.edits.delete(res.id)
    //   }
    // });

    this.usersService.save$$.next({
      payload, afterEffect: (res) => {
        // this.edits.delete(res.id)
      }
    });
  }
}
