/*
 * Copyright (C) 2014-2017 Taiga Agile LLC <taiga@taiga.io>
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
 * File: projects-listing.controller.coffee
 */

import * as _ from "lodash"
import "rxjs/add/operator/map"
import {Component} from "@angular/core"
import {Store} from "@ngrx/store"
import {IState} from "../../../ts/app.store"

@Component({
    selector: "tg-project-listing",
    template: require("./projects-listing.jade")()
})
export class ProjectsListing {
    projects:any;

    constructor(private store: Store<IState>) {
        this.projects = this.store
                            .select((state) => state.getIn(["global", "projects"]))
                            .map((state) => state.sortBy((i:any) => i.get('order')));
    }
}
