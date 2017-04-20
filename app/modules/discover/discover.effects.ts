import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { SetMostActiveAction, SetMostLikedAction } from "./discover.actions";
import * as Immutable from "immutable";
import {StorageService} from "./../../ts/modules/base/storage"
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
              return new SetMostActiveAction(projects)
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
              return new SetMostLikedAction(projects)
          })
        });

    constructor(private actions$: Actions, private storage: StorageService, private rs: ResourcesService) { }
}
