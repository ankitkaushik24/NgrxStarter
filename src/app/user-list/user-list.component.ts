import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { IUser } from "../home/users.model";

import { UsersDirective } from "../home/users.directive";
import { CommonModule } from "@angular/common";
import { UserSignalService } from "./user-signal.service";



@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styles: [``],
  standalone: true,
  imports: [CommonModule],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UserSignalService
    // HomeService,
    // UsersServiceState
  ]
})
export class UserListComponent extends UsersDirective {
    userSignalService = inject(UserSignalService);

    usersSignal = this.userSignalService.usersSignal;

  override onSave(user: IUser) {
    const payload = { ...user, ...this.updatedData[user.id] };
    console.log(payload);

    this.edits.delete(user.id);

    // this.homeService.save$$.next({
    //   payload, afterEffect: (res) => {
    //     // this.edits.delete(res.id)
    //   }
    // });

    this.userSignalService.save$$.next({
      payload, afterEffect: (res) => {
        // this.edits.delete(res.id)
      }
    });
  }

  check() {
    console.log(this.usersSignal());
  }
}
