import { createAction, createFeatureSelector, createReducer, createSelector, on, props } from '@ngrx/store';
import { IUser } from './users.model';

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap, switchMap } from 'rxjs/operators';
import { UsersDataService } from './users-data.service';

export namespace UserAction {
    export const loadUsers = createAction('[Users] Load');
    export const updateUser = createAction('[Users] update', props<{ payload: IUser }>());
    export const userUpdated = createAction('[Users] updated', props<{ payload: IUser }>());
    export const usersLoadFailure = createAction('[Users] Failure');
    export const usersLoaded = createAction('[Users] Loaded', props<{ payload: IUser[] }>());

    export const updateUserList = createAction('[Users] global update', props<{ payload: IUser[] }>());
    export const userListUpdated = createAction('[Users] updated global', props<{ payload: IUser[] }>())
}

import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface State extends EntityState<IUser> {
  // additional entities state properties
//   selectedUserId: string | null;
}

export const adapter: EntityAdapter<IUser> = createEntityAdapter<IUser>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
//   selectedUserId: null
});

export const usersReducer = createReducer(
    initialState,
    // on(UserAction.usersLoadFailure, state => ({ ...state, status: 'error' })),
    on(UserAction.usersLoaded, (state, { payload }) => {
        return adapter.setAll(payload, state);
    }),
    on(UserAction.userUpdated, (state, { payload }) => {
        return adapter.updateOne({ ...payload, changes: {}}, state);
    }),
    on(UserAction.userListUpdated, (state, { payload }) => {
        return adapter.setAll(payload, state);
    })
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

    updateUsers$ = createEffect(() => this.actions$.pipe(
        ofType(UserAction.updateUserList),
        switchMap(({ payload }) => this.usersDataService.updateAllUsers(payload)
            .pipe(
                map(users => UserAction.userListUpdated({ payload: users }))
            )
        )
    ))

}

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = adapter.getSelectors();


export const selectUserState = createFeatureSelector<State>('users');

// export const selectUserIds = createSelector(
//   selectUserState,
//   fromUser.selectUserIds // shorthand for usersState => fromUser.selectUserIds(usersState)
// );
// export const selectUserEntities = createSelector(
//   selectUserState,
//   fromUser.selectUserEntities
// );
export const selectAllUsers = createSelector(
  selectUserState,
  selectAll
);