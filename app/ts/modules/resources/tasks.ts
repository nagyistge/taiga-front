/*
 * Copyright (C) 2014-2017 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2017 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2017 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2017 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2017 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2017 Xavi Julian <xavier.julian@kaleidos.net>
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
 * File: modules/resources/tasks.coffee
 */


import {generateHash} from "../../app"
import * as _ from "lodash"
import {Injectable} from "@angular/core"
import {RepositoryService} from "../base/repository"
import {UrlsService} from "../base/urls"
import {HttpService} from "../base/http"
import {StorageService} from "../base/storage"

@Injectable()
export class TasksResource {
    hashSuffix = "tasks-queryparams";
    hashSuffixStatusColumnModes = "tasks-statuscolumnmodels";
    hashSuffixUsRowModes = "tasks-usrowmodels";

    constructor(private repo: RepositoryService,
                private http: HttpService,
                private urls: UrlsService,
                private storage: StorageService) {}

    get(projectId, taskId, extraParams) {
        let params = this.getQueryParams(projectId);
        params.project = projectId;

        params = _.extend({}, params, extraParams);

        return this.repo.queryOne("tasks", taskId, params);
    };

    getByRef(projectId, ref, extraParams) {
        let params = this.getQueryParams(projectId);
        params.project = projectId;
        params.ref = ref;

        params = _.extend({}, params, extraParams);

        return this.repo.queryOne("tasks", "by_ref", params);
    };

    listInAllProjects(filters) {
        return this.repo.queryMany("tasks", filters);
    }

    filtersData(params) {
        return this.repo.queryOneRaw("task-filters", null, params);
    }

    list(projectId, sprintId, userStoryId, params) {
        if (sprintId == null) { sprintId = null; }
        if (userStoryId == null) { userStoryId = null; }
        params = _.merge(params, {project: projectId});
        if (sprintId) { params.milestone = sprintId; }
        if (userStoryId) { params.user_story = userStoryId; }
        this.storeQueryParams(projectId, params);
        return this.repo.queryMany("tasks", params);
    };

    bulkCreate(projectId, sprintId, usId, data) {
        let url = this.urls.resolve("bulk-create-tasks");
        let params = {project_id: projectId, milestone_id: sprintId, us_id: usId, bulk_tasks: data};
        return this.http.post(url, params).then((result:any) => result.data);
    };

    upvote(taskId) {
        let url = this.urls.resolve("task-upvote", taskId);
        return this.http.post(url);
    };

    downvote(taskId) {
        let url = this.urls.resolve("task-downvote", taskId);
        return this.http.post(url);
    };

    watch(taskId) {
        let url = this.urls.resolve("task-watch", taskId);
        return this.http.post(url);
    };

    unwatch(taskId) {
        let url = this.urls.resolve("task-unwatch", taskId);
        return this.http.post(url);
    };

    bulkUpdateTaskTaskboardOrder(projectId, data) {
        let url = this.urls.resolve("bulk-update-task-taskboard-order");
        let params = {project_id: projectId, bulk_tasks: data};
        return this.http.post(url, params);
    };

    listValues(projectId, type) {
        let params = {"project": projectId};
        return this.repo.queryMany(type, params);
    };

    storeQueryParams(projectId, params) {
        let ns = `${projectId}:${this.hashSuffix}`;
        let hash = generateHash([projectId, ns]);
        return this.storage.set(hash, params);
    };

    getQueryParams(projectId) {
        let ns = `${projectId}:${this.hashSuffix}`;
        let hash = generateHash([projectId, ns]);
        return this.storage.get(hash) || {};
    };

    storeStatusColumnModes(projectId, params) {
        let ns = `${projectId}:${this.hashSuffixStatusColumnModes}`;
        let hash = generateHash([projectId, ns]);
        return this.storage.set(hash, params);
    };

    getStatusColumnModes(projectId) {
        let ns = `${projectId}:${this.hashSuffixStatusColumnModes}`;
        let hash = generateHash([projectId, ns]);
        return this.storage.get(hash) || {};
    };

    storeUsRowModes(projectId, sprintId, params) {
        let ns = `${projectId}:${this.hashSuffixUsRowModes}`;
        let hash = generateHash([projectId, sprintId, ns]);

        return this.storage.set(hash, params);
    };

    getUsRowModes(projectId, sprintId) {
        let ns = `${projectId}:${this.hashSuffixUsRowModes}`;
        let hash = generateHash([projectId, sprintId, ns]);

        return this.storage.get(hash) || {};
    };
};
