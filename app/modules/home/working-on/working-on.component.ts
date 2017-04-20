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
 * File: working-on.controller.coffee
 */

import * as Immutable from "immutable"
import {Component, Input} from "@angular/core"

@Component({
    selector: "tg-working-on",
    template: require("./working-on.jade")()
})
export class WorkingOn {
    @Input() assignedTo;
    @Input() watching;

    // constructor(private store: Store<IHomeData>) {
    //     this.assignedTo = this.store.select((state) => state.get('assigned-to'));
    //     this.watching = this.store.select((state) => state.get('watching'));
    // }

    // _setAssignedTo(workInProgress) {
    //     let epics = workInProgress.get("assignedTo").get("epics");
    //     let userStories = workInProgress.get("assignedTo").get("userStories");
    //     let tasks = workInProgress.get("assignedTo").get("tasks");
    //     let issues = workInProgress.get("assignedTo").get("issues");
    //
    //     this.assignedTo = userStories.concat(tasks).concat(issues).concat(epics);
    //     if (this.assignedTo.size > 0) {
    //         return this.assignedTo = <Immutable.Map<any,any>>this.assignedTo.sortBy(elem => elem.get("modified_date")).reverse();
    //     }
    // }
    //
    // _setWatching(workInProgress) {
    //     let epics = workInProgress.get("watching").get("epics");
    //     let userStories = workInProgress.get("watching").get("userStories");
    //     let tasks = workInProgress.get("watching").get("tasks");
    //     let issues = workInProgress.get("watching").get("issues");
    //
    //     this.watching = userStories.concat(tasks).concat(issues).concat(epics);
    //     if (this.watching.size > 0) {
    //         return this.watching = <Immutable.Map<any,any>>this.watching.sortBy(elem => elem.get("modified_date")).reverse();
    //     }
    // }

    // getWorkInProgress(userId) {
    //     return this.homeService.getWorkInProgress(userId).then(workInProgress => {
    //         this._setAssignedTo(workInProgress);
    //         return this._setWatching(workInProgress);
    //     });
    // }
}
