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
 * File: modules/resources/epics.coffee
 */


import {generateHash} from "../../app"

import {Injectable} from "@angular/core"
import {RepositoryService} from "../base/repository"
import {HttpService} from "../base/http"
import {UrlsService} from "../base/urls"
import {StorageService} from "../base/storage"
import * as Promise from "bluebird"

@Injectable()
export class EpicsResource {
    hashSuffix:string = "epics-queryparams";

    constructor(private repo: RepositoryService,
                private http: HttpService,
                private urls: UrlsService,
                private storage: StorageService) {}

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
