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
 * File: user-resource.service.coffee
 */

import * as Immutable from "immutable"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"

@Injectable()
export class UserResource {
    constructor(private urls: UrlsService,
                private http: HttpService) {}

    getUserStorage(key) {
        let url = this.urls.resolve("user-storage");

        if (key) {
            url += `/${key}`;
        }

        let httpOptions = {};

        return this.http.get(url, {}).then((response:any) => response.data.value);
    };

    setUserStorage(key, value) {
        let url = this.urls.resolve("user-storage") + '/' + key;

        let params = {
            key,
            value
        };

        return this.http.put(url, params);
    };

    createUserStorage(key, value) {
        let url = this.urls.resolve("user-storage");

        let params = {
            key,
            value
        };

        return this.http.post(url, params);
    };
};
