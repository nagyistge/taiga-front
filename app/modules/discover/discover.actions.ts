import * as Immutable from "immutable";
import { Action } from '@ngrx/store';

export class FetchMostLikedAction implements Action {
  readonly type = 'FETCH_MOST_LIKED';

  constructor(public payload: string) { }
}

export class FetchMostActiveAction implements Action {
  readonly type = 'FETCH_MOST_ACTIVE';

  constructor(public payload: string) { }
}

export class FetchProjectsStatsAction implements Action {
  readonly type = 'FETCH_PROJECTS_STATS';

  constructor(public payload: any) { }
}

export class FetchFeaturedProjectsAction implements Action {
  readonly type = 'FETCH_FEATURED_PROJECTS';

  constructor(public payload: any) { }
}

export class SetMostActiveAction implements Action {
  readonly type = 'SET_MOST_ACTIVE';

  constructor(public payload: Immutable.List<any>) { }
}

export class SetMostLikedAction implements Action {
  readonly type = 'SET_MOST_LIKED';

  constructor(public payload: Immutable.List<any>) { }
}

export class SetProjectsStatsAction implements Action {
  readonly type = 'SET_PROJECTS_STATS';

  constructor(public payload: number) { }
}

export class SetFeaturedProjectsAction implements Action {
  readonly type = 'SET_FEATURED_PROJECTS';

  constructor(public payload: Immutable.List<any>) { }
}
