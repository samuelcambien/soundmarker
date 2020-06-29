import { ActionReducerMap, createSelector, MemoizedSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

export interface AppState {
  router: fromRouter.RouterReducerState;
}

export const appReducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
};

export const routerStateSelector = (state: AppState) => state.router;
