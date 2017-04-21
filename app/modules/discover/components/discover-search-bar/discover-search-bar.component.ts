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
 * File: discover-search-bar.controller.coffee
 */

import {defineImmutableProperty} from "../../../../ts/utils"
import * as angular from "angular"
import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core"
import {DiscoverProjectsService} from "../../services/discover-projects.service"
import {Store} from "@ngrx/store"
import {IState} from "../../../../ts/app.store"

@Component({
    selector: 'tg-discover-search-bar',
    template: require("./discover-search-bar.jade")()
})
export class DiscoverSearchBar implements OnInit {
    @Output() change: EventEmitter<any>
    @Input() projectsCount
    q:any
    filter:any

    constructor(private discoverProjects: DiscoverProjectsService, private store: Store<IState>) {
        this.change = new EventEmitter();
    }

    ngOnInit() {
        console.log(this.projectsCount);
    }

    selectFilter(filter) {
        console.log({filter: this.filter, q: this.q});
        //return this.change.emit({filter, q: this.q});
        return false
    }

    submitFilter(test) {
        console.log({filter: this.filter, q: this.q});
        //return this.change.emit({filter: this.filter, q: this.q});
        return false
    }
}
