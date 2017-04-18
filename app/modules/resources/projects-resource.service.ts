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
 * File: projects-resource.service.coffee
 */

import * as Immutable from "immutable"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"
import {PaginateResponseService} from "../services/paginate-response.service"

@Injectable()
export class ProjectsResource {
    constructor(private urls: UrlsService,
                private http: HttpService,
                private paginateResponse: PaginateResponseService) {}

    create(data) {
        let url = this.urls.resolve('projects');

        return this.http.post(url, JSON.stringify(data))
            .then((result:any) => { return Immutable.fromJS(result.data); });
    };

    duplicate(projectId, data) {

        let url = this.urls.resolve("projects");
        url = `${url}/${projectId}/duplicate`;

        let members = data.users.map(member => ({"id": member}));

        let params = {
            "name": data.name,
            "description": data.description,
            "is_private": data.is_private,
            "users": members
        };

        return this.http.post(url, params);
    };

    getProjects(params, pagination) {
        if (params == null) { params = {}; }
        if (pagination == null) { pagination = true; }
        let url = this.urls.resolve("projects");

        let httpOptions = {};

        if (!pagination) {
            httpOptions = {
                headers: {
                    "x-lazy-pagination": true
                }
            };
        }

        return this.http.get(url, params, httpOptions);
    };

    getProjectBySlug(projectSlug) {
        let url = this.urls.resolve("projects");

        url = `${url}/by_slug?slug=${projectSlug}`;

        return this.http.get(url)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    getProjectsByUserId(userId, paginate) {
        if (paginate == null) { paginate = false; }
        let url = this.urls.resolve("projects");
        let httpOptions:any = {};

        if (!paginate) {
            httpOptions.headers = {
                "x-disable-pagination": "1"
            };
        }

        let params = {"member": userId, "order_by": "user_order"};

        return this.http.get(url, params, httpOptions)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    getProjectStats(projectId) {
        let url = this.urls.resolve("projects");
        url = `${url}/${projectId}`;

        return this.http.get(url)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    bulkUpdateOrder(bulkData) {
        let url = this.urls.resolve("bulk-update-projects-order");
        return this.http.post(url, bulkData);
    };

    getTimeline(projectId, page) {
        let params = {
            page,
            only_relevant: true
        };

        let url = this.urls.resolve("timeline-project");
        url = `${url}/${projectId}`;

        return this.http.get(url, params, {
            headers: {
                'x-lazy-pagination': true
            }
        }).then(function(result) {
            result = Immutable.fromJS(result);
            return paginateResponse.paginate(result);
        });
    };

    likeProject(projectId) {
        let url = this.urls.resolve("project-like", projectId);
        return this.http.post(url);
    };

    unlikeProject(projectId) {
        let url = this.urls.resolve("project-unlike", projectId);
        return this.http.post(url);
    };

    watchProject(projectId, notifyLevel) {
        let data = {
            notify_level: notifyLevel
        };
        let url = this.urls.resolve("project-watch", projectId);
        return this.http.post(url, data);
    };

    unwatchProject(projectId) {
        let url = this.urls.resolve("project-unwatch", projectId);
        return this.http.post(url);
    };

    contactProject(projectId, message) {
        let params = {
            project: projectId,
            comment: message
        };

        let url = this.urls.resolve("project-contact");
        return this.http.post(url, params);
    };

    transferValidateToken(projectId, token) {
        let data = {
            token
        };
        let url = this.urls.resolve("project-transfer-validate-token", projectId);
        return this.http.post(url, data);
    };

    transferAccept(projectId, token, reason) {
        let data = {
            token,
            reason
        };
        let url = this.urls.resolve("project-transfer-accept", projectId);
        return this.http.post(url, data);
    };

    transferReject(projectId, token, reason) {
        let data = {
            token,
            reason
        };
        let url = this.urls.resolve("project-transfer-reject", projectId);
        return this.http.post(url, data);
    };

    transferRequest(projectId) {
        let url = this.urls.resolve("project-transfer-request", projectId);
        return this.http.post(url);
    };

    transferStart(projectId, userId, reason) {
        let data = {
            user: userId,
            reason
        };

        let url = this.urls.resolve("project-transfer-start", projectId);
        return this.http.post(url, data);
    };
};
