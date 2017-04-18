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


import {sizeFormat} from "../../utils"
import * as angular from "angular"
import * as Promise from "bluebird"
import {Injectable} from "@angular/core"
import {RepositoryService} from "../base/repository"
import {UrlsService} from "../base/urls"
import {HttpService} from "../base/http"
import {ConfigurationService} from "../base/conf"

@Injectable()
export class UserSettingsResource {
    constructor(private config: ConfigurationService,
                private repo: RepositoryService,
                private http: HttpService,
                private urls: UrlsService) {}

    changeAvatar(file) {
        let maxFileSize = this.config.get("maxUploadFileSize", null);
        if (maxFileSize && (file.size > maxFileSize)) {
            let response = {
                status: 413,
                data: { _error_message: `'${file.name}' (${sizeFormat(file.size)}) is too heavy for our oompa \
loompas, try it with a smaller than (${sizeFormat(maxFileSize)})`
            }
            };
            return Promise.reject(response)
        }

        let data = new FormData();
        data.append('avatar', file);
        let options = {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        };
        let url = `${this.urls.resolve("users")}/change_avatar`;
        return this.http.post(url, data, {}, options);
    };

    removeAvatar() {
        let url = `${this.urls.resolve("users")}/remove_avatar`;
        return this.http.post(url);
    };

    changePassword(currentPassword, newPassword) {
        let url = `${this.urls.resolve("users")}/change_password`;
        let data = {
            current_password: currentPassword,
            password: newPassword
        };
        return this.http.post(url, data);
    };
};
