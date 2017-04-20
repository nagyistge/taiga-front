import * as Immutable from "immutable";
import { Action } from '@ngrx/store';

export class FetchCurrentUserAction implements Action {
  readonly type = 'FETCH_CURRENT_USER_DATA';

  constructor(public payload: any) { }
}

export class SetUserAction implements Action {
  readonly type = 'SET_USER';

  constructor(public payload: Immutable.Map<any, any>) { }
}

export class SetProjectsAction implements Action {
  readonly type = 'SET_PROJECTS';

  constructor(public payload: Immutable.List<any>) { }
}
