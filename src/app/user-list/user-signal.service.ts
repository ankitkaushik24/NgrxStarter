import { Injectable, inject, signal } from "@angular/core";
import { UsersDataService } from "../home/users-data.service";
import { Subject, map, switchMap, tap } from "rxjs";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { IUser } from "../home/users.model";

@Injectable()
export class UserSignalService {
    private usersDataService = inject(UsersDataService);
    
    // actions
    save$$ = new Subject<{ payload: IUser; afterEffect: (user: IUser) => void; }>();

    // selection
    private users$ = this.usersDataService.fetchUsers();

    updateUser$ = this.save$$.pipe(
        switchMap(({ payload, afterEffect }) => this.usersDataService.updateUser(payload).pipe(
            tap(afterEffect)
        )),
    )

    private userSignalList$ = this.users$.pipe(
        map(users => users.map(user => {
            return signal(user)
        }))
    );

    usersSignal = signal([] as any[]);

    constructor() {
        this.updateUser$.pipe(takeUntilDestroyed()).subscribe();

        this.userSignalList$.pipe(
            tap(res => this.usersSignal.set(res)),
            takeUntilDestroyed()).subscribe()
    }

}
