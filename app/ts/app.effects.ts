import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { SetUserAction, SetProjectsAction } from "./app.actions";
import * as Immutable from "immutable";
import {StorageService} from "./modules/base/storage"
import { ResourcesService } from "../modules/resources/resources.service";

@Injectable()
export class GlobalEffects {
    @Effect()
    fetchCurrentUser$: Observable<Action> = this.actions$
        .ofType('FETCH_CURRENT_USER_DATA')
        .switchMap(() => {
          let user = Immutable.fromJS(this.storage.get("userInfo"));
          let userId = null;
          if (user && user.get('id')) {
              userId = user.get('id');
          }
          return this.rs.projects.getProjectsByUserId(userId).flatMap((projects) => {
              return [
                  new SetUserAction(user),
                  new SetProjectsAction(projects)
              ]
          });
        });

    constructor(private storage: StorageService, private rs: ResourcesService, private actions$: Actions) {}
}
