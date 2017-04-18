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
 * File: modules/resources/memberships.coffee
 */

import * as _ from "lodash"

import {Injectable} from "@angular/core"
import {RepositoryService} from "../../ts/modules/base/repository"
import {HttpService} from "../../ts/modules/base/http"
import {UrlsService} from "../../ts/modules/base/urls"

@Injectable()
export class MembershipsResource {
    constructor(private repo: RepositoryService,
                private http: HttpService,
                private urls: UrlsService) {}

    get(id) {
        return this.repo.queryOne("memberships", id);
    }

    list(projectId, filters, enablePagination=true) {
        let options;
        let params = {project: projectId};
        params = _.extend({}, params, filters || {});
        if (enablePagination) {
            return this.repo.queryPaginated("memberships", params);
        }

        return this.repo.queryMany("memberships", params, (options={enablePagination}));
    };

    listByUser(userId, filters) {
        let params = {user: userId};
        params = _.extend({}, params, filters || {});
        return this.repo.queryPaginated("memberships", params);
    };

    resendInvitation(id) {
        let url = this.urls.resolve("memberships");
        return this.http.post(`${url}/${id}/resend_invitation`, {});
    };

    bulkCreateMemberships(projectId, data, invitation_extra_text) {
        let url = this.urls.resolve("bulk-create-memberships");
        let params = {project_id: projectId, bulk_memberships: data, invitation_extra_text};
        return this.http.post(url, params);
    };
};
