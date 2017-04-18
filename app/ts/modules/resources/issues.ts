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
 * File: modules/resources/issues.coffee
 */

import {generateHash} from "../../app"
import * as _ from "lodash"
import {Injectable} from "@angular/core"
import {RepositoryService} from "../base/repository"
import {HttpService} from "../base/http"
import {UrlsService} from "../base/urls"
import {StorageService} from "../base/storage"

@Injectable()
export class IssuesResource {
    hashSuffix = "issues-queryparams";

    constructor(private repo: RepositoryService,
                private http: HttpService,
                private urls: UrlsService,
                private storage: StorageService) {}

    get(projectId, issueId) {
        let params = this.getQueryParams(projectId);
        params.project = projectId;
        return this.repo.queryOne("issues", issueId, params);
    }

    getByRef(projectId, ref) {
        let params = this.getQueryParams(projectId);
        params.project = projectId;
        params.ref = ref;
        return this.repo.queryOne("issues", "by_ref", params);
    }

    listInAllProjects(filters) {
        return this.repo.queryMany("issues", filters);
    }

    list(projectId, filters, options) {
        let params = {project: projectId};
        params = _.extend({}, params, filters || {});
        this.storeQueryParams(projectId, params);
        return this.repo.queryPaginated("issues", params, options);
    }

    bulkCreate(projectId, data) {
        let url = this.urls.resolve("bulk-create-issues");
        let params = {project_id: projectId, bulk_issues: data};
        return this.http.post(url, params);
    }

    upvote(issueId) {
        let url = this.urls.resolve("issue-upvote", issueId);
        return this.http.post(url);
    }

    downvote(issueId) {
        let url = this.urls.resolve("issue-downvote", issueId);
        return this.http.post(url);
    }

    watch(issueId) {
        let url = this.urls.resolve("issue-watch", issueId);
        return this.http.post(url);
    }

    unwatch(issueId) {
        let url = this.urls.resolve("issue-unwatch", issueId);
        return this.http.post(url);
    }

    stats(projectId) {
        return this.repo.queryOneRaw("projects", `${projectId}/issues_stats`);
    }

    filtersData(params) {
        return this.repo.queryOneRaw("issues-filters", null, params);
    }

    listValues(projectId, type) {
        let params = {"project": projectId};
        this.storeQueryParams(projectId, params);
        return this.repo.queryMany(type, params);
    }

    storeQueryParams(projectId, params) {
        let ns = `${projectId}:${this.hashSuffix}`;
        let hash = generateHash([projectId, ns]);
        return this.storage.set(hash, params);
    }

    getQueryParams(projectId) {
        let ns = `${projectId}:${this.hashSuffix}`;
        let hash = generateHash([projectId, ns]);
        return this.storage.get(hash) || {};
    }
};
