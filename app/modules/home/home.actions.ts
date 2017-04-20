import * as Immutable from "immutable";
import { Action } from '@ngrx/store';

export class FetchAssignedToAction implements Action {
  readonly type = 'FETCH_ASSIGNED_TO';

  constructor(public payload: number) { }
}

export class FetchWatchingAction implements Action {
  readonly type = 'FETCH_WATCHING';

  constructor(public payload: number) { }
}

export class SetAssignedToAction implements Action {
  readonly type = 'SET_ASSIGNED_TO';

  constructor(public payload: Immutable.List<any>) { }
}

export class SetWatchingAction implements Action {
  readonly type = 'SET_WATCHING';

  constructor(public payload: Immutable.List<any>) { }
}
