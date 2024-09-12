import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { rxState } from "@rx-angular/state";
import { Subject, switchMap, tap } from "rxjs";
import { IUser } from "./users.model";
import { UsersDataService } from "./users-data.service";

@Injectable()
export class UsersServiceState {
    // actions
    save$$ = new Subject<{ payload: IUser; afterEffect: (user: IUser) => void; }>();

    private usersDataService = inject(UsersDataService);

    // event
    private userUpdated$ = this.save$$.pipe(
        switchMap(({ payload, afterEffect }) => this.usersDataService.updateUser(payload).pipe(tap(afterEffect)))
    );

    private state = rxState<{ users: IUser[] }>(({ set, connect }) => {
        // connect data source to state
        connect('users', this.usersDataService.fetchUsers());

        connect('users', this.userUpdated$, ({ users }, user) => {
            return this.onUpdated(user, users);
        });
    });

    // selections
    users$ = this.state.select('users');

    private onUpdated = (user: IUser, users: IUser[]) => {
        return users.map((item) => {
            if (item.id === user.id) {
                return { ...item, ...user };
            }
            return item;
        });
    };
}