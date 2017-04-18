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
 * File: users-resource.service.coffee
 */

import * as Immutable from "immutable"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"

@Injectable()
export class UserResource {
    constructor(private urls: UrlsService,
                private http: HttpService,
                private paginateResponse: PaginateResponseService) {}

    getUserByUsername(username) {
        let url = this.urls.resolve("by_username");

        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        let params = {
            username
        };

        return this.http.get(url, params, httpOptions)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    getStats(userId) {
        let url = this.urls.resolve("user-stats", userId);

        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        return this.http.get(url, {}, httpOptions)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    getContacts(userId, excludeProjectId) {
        let url = this.urls.resolve("user-contacts", userId);

        let params:any = {};
        if (excludeProjectId != null) { params.exclude_project = excludeProjectId; }

        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        return this.http.get(url, params, httpOptions)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    getLiked(userId, page, type, q) {
        let url = this.urls.resolve("user-liked", userId);

        let params:any = {};
        if (page != null) { params.page = page; }
        if (type != null) { params.type = type; }
        if (q != null) { params.q = q; }

        params.only_relevant = true;

        return this.http.get(url, params, {
            headers: {
                'x-lazy-pagination': true
            }
        }).then(function(result) {
            result = Immutable.fromJS(result);
            return paginateResponse.paginate(result);
        });
    };

    getVoted(userId, page, type, q) {
        let url = this.urls.resolve("user-voted", userId);

        let params:any = {};
        if (page != null) { params.page = page; }
        if (type != null) { params.type = type; }
        if (q != null) { params.q = q; }

        return this.http.get(url, params, {
            headers: {
                'x-lazy-pagination': true
            }
        }).then(function(result) {
            result = Immutable.fromJS(result);
            return paginateResponse.paginate(result);
        });
    };

    getWatched(userId, page, type, q) {
        let url = this.urls.resolve("user-watched", userId);

        let params:any = {};
        if (page != null) { params.page = page; }
        if (type != null) { params.type = type; }
        if (q != null) { params.q = q; }

        return this.http.get(url, params, {
            headers: {
                'x-lazy-pagination': true
            }
        }).then(function(result) {
            result = Immutable.fromJS(result);
            return paginateResponse.paginate(result);
        });
    };

    getProfileTimeline(userId, page) {
        let params = {
            page
        };

        let url = this.urls.resolve("timeline-profile");
        url = `${url}/${userId}`;

        return this.http.get(url, params, {
            headers: {
                'x-lazy-pagination': true
            }
        }).then(function(result) {
            result = Immutable.fromJS(result);
            return paginateResponse.paginate(result);
        });
    };

    getUserTimeline(userId, page) {
        let params = {
            page,
            only_relevant: true
        };

        let url = this.urls.resolve("timeline-user");
        url = `${url}/${userId}`;


        return this.http.get(url, params, {
            headers: {
                'x-lazy-pagination': true
            }
        }).then(function(result) {
            result = Immutable.fromJS(result);
            return paginateResponse.paginate(result);
        });
    };
};
