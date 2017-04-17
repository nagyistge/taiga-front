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
 * File: modules/base/http.coffee
 */

import {Service} from "../../../ts/classes"
import * as _ from "lodash"
import * as angular from "angular"

export class HttpService extends Service {
    http:any
    storage:any
    cacheFactory:any
    translate:any
    cache:any

    static initClass() {
        this.$inject = ["$http", "$tgStorage", "$cacheFactory", "$translate"];
    }

    constructor(http, storage, cacheFactory, translate) {
        super();
        this.http = http;
        this.storage = storage;
        this.cacheFactory = cacheFactory;
        this.translate = translate;
        this.cache = this.cacheFactory("httpget");
    }
    headers() {
        let headers = {};

        // Authorization
        let token = this.storage.get('token');
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Accept-Language
        let lang = this.translate.preferredLanguage();
        if (lang) {
            headers["Accept-Language"] = lang;
        }

        return headers;
    }

    request(options) {
        options.headers = _.assign({}, options.headers || {}, this.headers());

        return this.http(options);
    }

    get(url, params, options) {
        options = _.assign({method: "GET", url}, options);
        if (params) { options.params = params; }

        // prevent duplicated http request
        options.cache = this.cache;

        return this.request(options).finally(data => {
            return this.cache.removeAll();
        });
    }

    post(url, data, params, options) {
        options = _.assign({method: "POST", url}, options);

        if (data) { options.data = data; }
        if (params) { options.params = params; }

        return this.request(options);
    }

    put(url, data, params, options) {
        options = _.assign({method: "PUT", url}, options);
        if (data) { options.data = data; }
        if (params) { options.params = params; }
        return this.request(options);
    }

    patch(url, data, params, options) {
        options = _.assign({method: "PATCH", url}, options);
        if (data) { options.data = data; }
        if (params) { options.params = params; }
        return this.request(options);
    }

    delete(url, data, params, options) {
        options = _.assign({method: "DELETE", url}, options);
        if (data) { options.data = data; }
        if (params) { options.params = params; }
        return this.request(options);
    }
}
HttpService.initClass();
