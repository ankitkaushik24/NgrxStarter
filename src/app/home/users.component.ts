import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { UserAction } from "./users.store";
import { UsersDirective } from "./users.directive";
import { IUser } from "./users.model";
import { UsersServiceState } from "./users.service.state";

@Component({
  selector: 'users',
  templateUrl: './home.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // HomeService,
    UsersServiceState
  ]
})
export class UsersComponent extends UsersDirective implements OnInit {
    private store = inject(Store);

    users$ = this.store.select(state => state.users.users);

    ngOnInit(): void {
        this.store.dispatch(UserAction.loadUsers());
    }

    override onSave(user: IUser): void {
        const payload = { ...user, ...this.updatedData[user.id] };
        super.onSave(user);
        this.store.dispatch(UserAction.updateUser({ payload }))
    }
}