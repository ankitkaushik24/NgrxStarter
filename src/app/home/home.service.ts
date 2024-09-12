import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Subject, switchMap, tap } from "rxjs";
import { IUser, apiUrl } from "./users.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UsersDataService } from "./users-data.service";

@Injectable()
export class HomeService {
    private usersDataService = inject(UsersDataService);

    // actions
    save$$ = new Subject<{ payload: IUser; afterEffect: (user: IUser) => void; }>();

    // selection
    users$ = this.usersDataService.fetchUsers();

    updateUser$ = this.save$$.pipe(
        switchMap(({ payload, afterEffect }) => this.usersDataService.updateUser(payload).pipe(
            tap(afterEffect)
        )),
    )

    constructor() {
        this.updateUser$.pipe(takeUntilDestroyed()).subscribe();
    }
}
