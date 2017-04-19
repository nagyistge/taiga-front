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
 * File: discover-projects.service.coffee
 */

import {Service} from "../../../ts/classes"
import {defineImmutableProperty} from "../../../ts/utils"
import * as angular from "angular"
import * as _ from "lodash"
import * as Immutable from "immutable"

import {Injectable} from "@angular/core"
import {ResourcesService} from "../../resources/resources.service"
import {ProjectsService} from "../../projects/projects.service"

@Injectable()
export class DiscoverProjectsService {
    static _discoverParams:any = undefined;
    _mostLiked:any
    _mostActive:any
    _featured:any
    _searchResult:any
    _projectsCount:any
    _nextSearchPage:any
    mostLiked:any
    mostActive:any
    featured:any
    projectsCount:any
    nextSearchPage:any
    searchResult:any
    decorate:any

    constructor(private rs: ResourcesService, private projectsService: ProjectsService) {
        DiscoverProjectsService._discoverParams = {
            discover_mode: true
        };

        this._mostLiked = Immutable.List();
        this._mostActive = Immutable.List();
        this._featured = Immutable.List();
        this._searchResult = Immutable.List();
        this._projectsCount = 0;

        this.decorate = this.projectsService._decorate.bind(this.projectsService);

        defineImmutableProperty(this, "mostLiked", () => { return this._mostLiked; });
        defineImmutableProperty(this, "mostActive", () => { return this._mostActive; });
        defineImmutableProperty(this, "featured", () => { return this._featured; });
        defineImmutableProperty(this, "searchResult", () => { return this._searchResult; });
        defineImmutableProperty(this, "nextSearchPage", () => { return this._nextSearchPage; });
        defineImmutableProperty(this, "projectsCount", () => { return this._projectsCount; });
    }

    fetchMostLiked(params) {
        let _params = _.extend({}, DiscoverProjectsService._discoverParams, params);
        return this.rs.projects.getProjects(_params, false)
            .then((result:any) => {
                let data = result.data.slice(0, 5);

                let projects = Immutable.fromJS(data);
                projects = projects.map(this.decorate);

                return this._mostLiked = projects;
        });
    }

    fetchMostActive(params) {
        let _params = _.extend({}, DiscoverProjectsService._discoverParams, params);
        return this.rs.projects.getProjects(_params, false)
            .then((result:any) => {
                let data = result.data.slice(0, 5);

                let projects = Immutable.fromJS(data);
                projects = projects.map(this.decorate);

                return this._mostActive = projects;
        });
    }

    fetchFeatured() {
        let _params = _.extend({}, DiscoverProjectsService._discoverParams);
        _params.is_featured = true;

        return this.rs.projects.getProjects(_params, false)
            .then((result:any) => {
                let data = result.data.slice(0, 4);

                let projects = Immutable.fromJS(data);
                projects = projects.map(this.decorate);

                return this._featured = projects;
        });
    }

    resetSearchList() {
        return this._searchResult = Immutable.List();
    }

    fetchStats() {
        return this.rs.stats.discover().then(discover => {
            return this._projectsCount = discover.getIn(['projects', 'total']);
        });
    }

    fetchSearch(params) {
        let _params = _.extend({}, DiscoverProjectsService._discoverParams, params);
        return this.rs.projects.getProjects(_params)
            .then((result:any) => {
                this._nextSearchPage = !!result.headers['X-Pagination-Next'];

                let projects = Immutable.fromJS(result.data);
                projects = projects.map(this.decorate);

                return this._searchResult = this._searchResult.concat(projects);
        });
    }
}
