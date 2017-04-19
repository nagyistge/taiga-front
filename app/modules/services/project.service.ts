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
 * File: project.service.coffee
 */

import {defineImmutableProperty} from "../../ts/utils"
import * as angular from "angular"
import * as Immutable from "immutable"
import * as Promise from "bluebird"

export class ProjectService {
    projectsService:any
    xhrError:any
    userActivityService:any
    interval:any
    _project:any
    _section:any
    _sectionsBreadcrumb: Immutable.List<any>
    _activeMembers: Immutable.List<any>
    project: Immutable.Map<any,any>

    static initClass() {
        this.$inject = [
            "tgProjectsService",
            "tgXhrErrorService",
            "tgUserActivityService",
            "$interval"
        ];
    }

    constructor(projectsService, xhrError, userActivityService, interval) {
        this.projectsService = projectsService;
        this.xhrError = xhrError;
        this.userActivityService = userActivityService;
        this.interval = interval;
        this._project = null;
        this._section = null;
        this._sectionsBreadcrumb = Immutable.List();
        this._activeMembers = Immutable.List();

        defineImmutableProperty(this, "project", () => { return this._project; });
        defineImmutableProperty(this, "section", () => { return this._section; });
        defineImmutableProperty(this, "sectionsBreadcrumb", () => { return this._sectionsBreadcrumb; });
        defineImmutableProperty(this, "activeMembers", () => { return this._activeMembers; });

        if (!window.localStorage.e2e) { this.autoRefresh(); }
    }

    cleanProject() {
        this._project = null;
        this._activeMembers = Immutable.List();
        this._section = null;
        return this._sectionsBreadcrumb = Immutable.List();
    }

    autoRefresh() {
        let intervalId = this.interval(() => {
            return this.fetchProject();
        }
        , 60 * 10 * 1000);

        this.userActivityService.onInactive(() => this.interval.cancel(intervalId));
        return this.userActivityService.onActive(() => {
            this.fetchProject();
            return this.autoRefresh();
        });
    }

    setSection(section) {
        this._section = section;

        if (section) {
            return this._sectionsBreadcrumb = this._sectionsBreadcrumb.push(this._section);
        } else {
            return this._sectionsBreadcrumb = Immutable.List();
        }
    }

    setProject(project) {
        this._project = project;
        return this._activeMembers = this._project.get('members').filter(member => member.get('is_active'));
    }

    setProjectBySlug(pslug) {
        return new Promise((function(resolve, reject) {
            if (!this.project || (this.project.get('slug') !== pslug)) {
                return this.projectsService
                    .getProjectBySlug(pslug)
                    .subscribe(project => {
                        this.setProject(project);
                        return resolve();
                    }).catch(xhr => {
                        return this.xhrError.response(xhr);
                    });

            } else { return resolve(); }
        }.bind(this)));
    }

    fetchProject() {
        if (!this.project) { return; }

        let pslug = this.project.get('slug');

        return this.projectsService.getProjectBySlug(pslug).subscribe(project => this.setProject(project));
    }

    hasPermission(permission) {
        return this._project.get('my_permissions').indexOf(permission) !== -1;
    }

    isEpicsDashboardEnabled() {
        return this._project.get("is_epics_activated");
    }
}
ProjectService.initClass();
