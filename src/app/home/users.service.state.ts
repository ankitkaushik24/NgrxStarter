import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { rxState } from "@rx-angular/state";
import { Subject, switchMap, tap } from "rxjs";
import { IUser, apiUrl } from "./users.model";

@Injectable()
export class UsersServiceState {
    // actions
    save$$ = new Subject<{ payload: IUser; afterEffect: (user: IUser) => void; }>();

    private http = inject(HttpClient);

    // event
    private userUpdated$ = this.save$$.pipe(
        switchMap(({ payload, afterEffect }) => this.updateUser(payload).pipe(tap(afterEffect)))
    );

    private state = rxState<{ users: IUser[] }>(({ set, connect }) => {
        // connect data source to state
        connect('users', this.fetchUsers());

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

    // API Fn
    private fetchUsers() {
        return this.http.get<IUser[]>(apiUrl);
    }

    // API Fn
    private updateUser(payload: IUser) {
        return this.http.put<IUser>(`${apiUrl}/${payload.id}`, payload);
    }
}