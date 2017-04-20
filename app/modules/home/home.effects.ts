import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { SetAssignedToAction, SetWatchingAction } from "./home.actions";
import * as Immutable from "immutable";
import {StorageService} from "./../../ts/modules/base/storage"
import { ResourcesService } from "../resources/resources.service";

@Injectable()
export class HomeEffects {
    @Effect()
    fetchAssignedTo$: Observable<Action> = this.actions$
        .ofType('FETCH_ASSIGNED_TO')
        .map(toPayload)
        .switchMap(userId => {
          return this.rs.projects.getProjectsByUserId(userId).map((projects) => {
              return new SetAssignedToAction(projects)
          })
        });

    @Effect()
    fetchWatching$: Observable<Action> = this.actions$
        .ofType('FETCH_WATCHING')
        .map(toPayload)
        .switchMap(userId => {
          return this.rs.projects.getProjectsByUserId(userId).map((projects) => {
              return new SetWatchingAction(projects)
          })
        });

    constructor(private actions$: Actions, private storage: StorageService, private rs: ResourcesService) { }
}
