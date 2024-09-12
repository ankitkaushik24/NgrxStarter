import { createAction, createReducer, on, props } from '@ngrx/store';
import { IUser } from './users.model';

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { UsersDataService } from './users-data.service';

export namespace UserAction {
    export const loadUsers = createAction('[Users] Load');
    export const updateUser = createAction('[Users] update', props<{ payload: IUser }>());
    export const userUpdated = createAction('[Users] updated', props<{ payload: IUser }>());
    export const usersLoadFailure = createAction('[Users] Failure');
    export const usersLoaded = createAction('[Users] Loaded', props<{ payload: IUser[] }>());
}

const initialState = {
    users: [] as IUser[],
    status: 'idle'
};

export const usersReducer = createReducer(
    initialState,
    on(UserAction.usersLoadFailure, state => ({ ...state, status: 'error' })),
    on(UserAction.usersLoaded, (state, { payload }) => ({ users: payload, status: 'success' })),
    on(UserAction.userUpdated, (state, { payload }) => ({
        ...state,
        users: state.users.map((item) => {
            if (item.id === payload.id) {
                return { ...item, ...payload };
            }
            return item;
        })
    }))
);

@Injectable()
export class UsersEffects {
    actions$ = inject(Actions);
    usersDataService = inject(UsersDataService);

    loadUsers$ = createEffect(() => this.actions$.pipe(
        ofType(UserAction.loadUsers),
        exhaustMap(() => this.usersDataService.fetchUsers()
            .pipe(
                map(users => (UserAction.usersLoaded({ payload: users }))),
                catchError(() => of(UserAction.usersLoadFailure()))
            ))
    )
    );

    updateUser$ = createEffect(() => this.actions$.pipe(
        ofType(UserAction.updateUser),
        mergeMap(({ payload }) => this.usersDataService.updateUser(payload)
            .pipe(
                map(user => UserAction.userUpdated({ payload: user }))
            )
        )
    ))

}