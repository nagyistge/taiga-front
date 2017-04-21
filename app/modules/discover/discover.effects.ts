import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import * as actions from "./discover.actions";
import * as Immutable from "immutable";
import { ResourcesService } from "../resources/resources.service";

@Injectable()
export class DiscoverEffects {
    @Effect()
    fetchAssignedTo$: Observable<Action> = this.actions$
        .ofType('FETCH_MOST_ACTIVE')
        .map(toPayload)
        .switchMap(period => {
          let orderBy = `-total_activity_${period}`
          return this.rs.projects.getProjects({discover_mode: true, order_by: orderBy}, false).map((result) => {
              let projects = Immutable.fromJS(result.data.slice(0, 5))
              return new actions.SetMostActiveAction(projects)
          })
        });

    @Effect()
    fetchWatching$: Observable<Action> = this.actions$
        .ofType('FETCH_MOST_LIKED')
        .map(toPayload)
        .switchMap(period => {
          let orderBy = `-total_fans_${period}`
          return this.rs.projects.getProjects({discover_mode: true, order_by: orderBy}, false).map((result) => {
              let projects = Immutable.fromJS(result.data.slice(0, 5))
              return new actions.SetMostLikedAction(projects)
          })
        });

    @Effect()
    fetchProjectsStats$: Observable<Action> = this.actions$
        .ofType('FETCH_PROJECTS_STATS')
        .map(toPayload)
        .switchMap(() => {
           return this.rs.stats.discover().map(stats => {
               return new actions.SetProjectsStatsAction(stats.getIn(["projects", "total"]))
           });
        });

    @Effect()
    fetchFeaturedProjects$: Observable<Action> = this.actions$
        .ofType('FETCH_FEATURED_PROJECTS')
        .map(toPayload)
        .switchMap(() => {
           return this.rs.projects.getProjects({is_featured: true, discover_mode: true}, false)
               .map(result => {
                   let data = result.data.slice(0, 4);
                   let projects = Immutable.fromJS(data);
                   return new actions.SetFeaturedProjectsAction(projects);
           });
        });

    constructor(private actions$: Actions, private rs: ResourcesService) { }
}
