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

import {generateHash} from "../../app"

import * as angular from "angular"
import * as Immutable from "immutable"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"
import {StorageService} from "../../ts/modules/base/storage"
// TODO: Remove repository usage
import {RepositoryService} from "../../ts/modules/base/repository"

@Injectable()
export class EpicsResource {
    hashSuffix:string = "epics-queryparams";

    constructor(private repo: RepositoryService,
                private urls: UrlsService,
                private http: HttpService,
                private storage: StorageService) {}

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

    getByRef(projectId:number, ref:number):Promise<any> {
        let params = this.getQueryParams(projectId);
        params.project = projectId;
        params.ref = ref;
        return this.repo.queryOne("epics", "by_ref", params);
    };

    listValues(projectId:number, type:string):Promise<any[]> {
        let params = {"project": projectId};
        this.storeQueryParams(projectId, params);
        return this.repo.queryMany(type, params);
    };

    storeQueryParams(projectId:number, params:any):void {
        let ns = `${projectId}:${this.hashSuffix}`;
        let hash = generateHash([projectId, ns]);
        this.storage.set(hash, params);
    };

    getQueryParams(projectId:number):any {
        let ns = `${projectId}:${this.hashSuffix}`;
        let hash = generateHash([projectId, ns]);
        return this.storage.get(hash) || {};
    };

    upvote(epicId:number):Promise<any> {
        let url = this.urls.resolve("epic-upvote", epicId);
        return this.http.post(url);
    };

    downvote(epicId:number):Promise<any> {
        let url = this.urls.resolve("epic-downvote", epicId);
        return this.http.post(url);
    };

    watch(epicId:number):Promise<any> {
        let url = this.urls.resolve("epic-watch", epicId);
        return this.http.post(url);
    };

    unwatch(epicId:number):Promise<any> {
        let url = this.urls.resolve("epic-unwatch", epicId);
        return this.http.post(url);
    };
};
