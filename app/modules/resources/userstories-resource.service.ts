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
 * File: userstories-resource.service.coffee
 */

import * as Immutable from "immutable"
import {generateHash} from "../../ts/app"
import * as _ from "lodash"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"
import {StorageService} from "../../ts/modules/base/storage"
import {RepositoryService} from "../../ts/modules/base/repository"

@Injectable()
export class UserstoriesResource {
    hashSuffix = "userstories-queryparams";

    constructor(private repo: RepositoryService,
                private http: HttpService,
                private urls: UrlsService,
                private storage: StorageService) {}

    get(projectId, usId, extraParams) {
        let params = this.getQueryParams(projectId);
        params.project = projectId;

        params = _.extend({}, params, extraParams);

        return this.repo.queryOne("userstories", usId, params);
    };

    getByRef(projectId, ref, extraParams) {
        if (extraParams == null) { extraParams = {}; }
        let params = this.getQueryParams(projectId);
        params.project = projectId;
        params.ref = ref;
        params = _.extend({}, params, extraParams);

        return this.repo.queryOne("userstories", "by_ref", params);
    };

    filtersData(params) {
        return this.repo.queryOneRaw("userstories-filters", null, params);
    }

    listUnassigned(projectId, filters, pageSize) {
        let params = {"project": projectId, "milestone": "null"};
        params = _.extend({}, params, filters || {});
        this.storeQueryParams(projectId, params);

        return this.repo.queryMany("userstories", _.extend(params, {
            page_size: pageSize
        }), {
            enablePagination: true
        }, true);
    };

    listAll(projectId, filters) {
        let params = {"project": projectId};
        params = _.extend({}, params, filters || {});
        this.storeQueryParams(projectId, params);

        return this.repo.queryMany("userstories", params);
    };

    bulkCreate(projectId, status, bulk) {
        let data = {
            project_id: projectId,
            status_id: status,
            bulk_stories: bulk
        };

        let url = this.urls.resolve("bulk-create-us");

        return this.http.post(url, data);
    };

    upvote(userStoryId) {
        let url = this.urls.resolve("userstory-upvote", userStoryId);
        return this.http.post(url);
    };

    downvote(userStoryId) {
        let url = this.urls.resolve("userstory-downvote", userStoryId);
        return this.http.post(url);
    };

    watch(userStoryId) {
        let url = this.urls.resolve("userstory-watch", userStoryId);
        return this.http.post(url);
    };

    unwatch(userStoryId) {
        let url = this.urls.resolve("userstory-unwatch", userStoryId);
        return this.http.post(url);
    };

    bulkUpdateBacklogOrder(projectId, data) {
        let url = this.urls.resolve("bulk-update-us-backlog-order");
        let params = {project_id: projectId, bulk_stories: data};
        return this.http.post(url, params);
    };

    bulkUpdateMilestone(projectId, milestoneId, data) {
        let url = this.urls.resolve("bulk-update-us-milestone");
        let params = {project_id: projectId, milestone_id: milestoneId, bulk_stories: data};
        return this.http.post(url, params);
    };

    bulkUpdateKanbanOrder(projectId, data) {
        let url = this.urls.resolve("bulk-update-us-kanban-order");
        let params = {project_id: projectId, bulk_stories: data};
        return this.http.post(url, params);
    };

    listValues(projectId, type) {
        let params = {"project": projectId};
        this.storeQueryParams(projectId, params);
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

    storeShowTags(projectId, showTags) {
        let hash = generateHash([projectId, 'showTags']);
        return this.storage.set(hash, showTags);
    };

    getShowTags(projectId) {
        let hash = generateHash([projectId, 'showTags']);
        return this.storage.get(hash) || null;
    };
    listInAllProjects(params) {
        let url = this.urls.resolve("userstories");

        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        return this.http.get(url, params, httpOptions)
            .map((result:any) => Immutable.fromJS(result.data));
    };

    listAllInProject(projectId) {
        let url = this.urls.resolve("userstories");

        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        let params = {
            project: projectId
        };

        return this.http.get(url, params, httpOptions)
            .map((result:any) => Immutable.fromJS(result.data));
    };

    listInEpic(epicIid) {
        let url = this.urls.resolve("userstories");

        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        let params = {
            epic: epicIid,
            order_by: 'epic_order',
            include_tasks: true
        };

        return this.http.get(url, params, httpOptions)
            .map((result:any) => Immutable.fromJS(result.data));
    };
};
