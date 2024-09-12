import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Subject, switchMap, tap } from "rxjs";
import { IUser, apiUrl } from "./users.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable()
export class HomeService {
    private http = inject(HttpClient);

    // actions
    save$$ = new Subject<{ payload: IUser; afterEffect: (user: IUser) => void; }>();

    // selection
    users$ = this.http.get<IUser[]>(apiUrl);


    updateUser$ = this.save$$.pipe(
        switchMap(({ payload, afterEffect }) =>
            this.http.put<IUser>(`${apiUrl}/${payload.id}`, payload).pipe(
                tap(afterEffect)
            )
        ),
    )

    constructor() {
        this.updateUser$.pipe(takeUntilDestroyed()).subscribe();
    }
}
