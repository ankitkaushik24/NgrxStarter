import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { UserAction, selectAllUsers } from "./users.store";
import { UsersDirective } from "./users.directive";
import { IUser } from "./users.model";
import { UsersServiceState } from "./users.service.state";

@Component({
  selector: 'users',
  templateUrl: './home.component.html',
  styles: [``],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // HomeService,
    UsersServiceState
  ]
})
export class UsersComponent extends UsersDirective implements OnInit {
    private store = inject(Store);

    users$ = this.store.select(selectAllUsers);

    ngOnInit(): void {
        this.store.dispatch(UserAction.loadUsers());
    }

    override onSave(user: IUser): void {
        const payload = { ...user, ...this.updatedData[user.id] };


        super.onSave(user);
        this.store.dispatch(UserAction.updateUser({ payload }))
    }

    override onGlobalSave(users: IUser[]) {
      // this.store.dispatch(UserAction.updateUser({ payload }))
      const updatedUsers = users.map(user => {
        return {...user, ...this.updatedData[user.id]};
      });

      this.store.dispatch(UserAction.updateUserList({ payload: updatedUsers }));

      this.isGlobalEdit = false;
    }
}