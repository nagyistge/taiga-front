/*
 * Copyright (C) 2014-2015 Taiga Agile LLC <taiga@taiga.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: home.controller.coffee
 */

import { CurrentUserService } from "../services/current-user.service";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { IState } from "../../ts/app.store";
import { IHomeState } from "./home.store";
import { NavigationUrlsService } from "../../ts/modules/base/navurls.service";

import {Component, OnInit, ChangeDetectionStrategy} from "@angular/core"

@Component({
    selector: "tg-home",
    template: require("./home.jade")(),
})
export class Home implements OnInit {
    user;
    projects;
    assignedTo;
    watching;

    constructor(private router: Router,
                private store: Store<IState>,
                private navurls: NavigationUrlsService) {
      this.user = this.store.select((state) => state.getIn(['global', 'user']));
      this.projects = this.store.select((state) => state.getIn(['global', 'projects']));
      this.assignedTo = this.store.select((state) => state.getIn(['home', 'assigned-to']));
      this.watching = this.store.select((state) => state.getIn(['home', 'watching']));
    }

    ngOnInit() {
        this.store.dispatch({
            type: "FETCH_ASSIGNED_TO",
            payload: null,
        })
        this.store.dispatch({
            type: "FETCH_WATCHING",
            payload: null,
        })
        // if (!this.user) {
        //     // this.router.navigateByUrl(this.navurls.resolve("discover"));
        // }
    }
}
