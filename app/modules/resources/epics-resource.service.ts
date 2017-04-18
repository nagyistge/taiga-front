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
 * File: epics-resource.service.coffee
 */

import * as angular from "angular"
import * as Immutable from "immutable"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"

@Injectable()
export class EpicsResource {
    constructor(private urls: UrlsService,
                private http: HttpService) {}

    listInAllProjects(params) {
        let url = this.urls.resolve("epics");

        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        return this.http.get(url, params, httpOptions)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    list(projectId, page) {
        if (page == null) { page = 0; }
        let url = this.urls.resolve("epics");

        let params = {project: projectId, page};

        return this.http.get(url, params)
            .then((result:any) =>
                ({
                    list: Immutable.fromJS(result.data),
                    headers: result.headers
                }));
    };

    patch(id, patch) {
        let url = this.urls.resolve("epics") + `/${id}`;

        return this.http.patch(url, patch)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    post(params) {
        let url = this.urls.resolve("epics");

        return this.http.post(url, params)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    reorder(id, data, setOrders) {
        let url = this.urls.resolve("epics") + `/${id}`;

        let options = {"headers": {"set-orders": JSON.stringify(setOrders)}};

        return this.http.patch(url, data, null, options)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    addRelatedUserstory(epicId, userstoryId) {
        let url = this.urls.resolve("epic-related-userstories", epicId);

        let params = {
            user_story: userstoryId,
            epic: epicId
        };

        return this.http.post(url, params);
    };

    reorderRelatedUserstory(epicId, userstoryId, data, setOrders) {
        let url = this.urls.resolve("epic-related-userstories", epicId) + `/${userstoryId}`;

        let options = {"headers": {"set-orders": JSON.stringify(setOrders)}};

        return this.http.patch(url, data, null, options);
    };

    bulkCreateRelatedUserStories(epicId, projectId, bulk_userstories) {
        let url = this.urls.resolve("epic-related-userstories-bulk-create", epicId);

        let params = {
            bulk_userstories,
            project_id: projectId
        };

        return this.http.post(url, params);
    };

    deleteRelatedUserstory(epicId, userstoryId) {
        let url = this.urls.resolve("epic-related-userstories", epicId) + `/${userstoryId}`;

        return this.http.delete(url);
    };
};
