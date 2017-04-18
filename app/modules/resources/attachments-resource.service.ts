/*
 * Copyright (C) 2014-2017 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2017 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2017 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2017 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2017 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2017 Xavi Julian <xavier.julian@kaleidos.net>
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
 * File: attachments-resource.service.coffee
 */

import {sizeFormat} from "../../ts/utils"
import * as angular from "angular"
import * as Immutable from "immutable"
import * as Promise from "bluebird"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"
import {ConfigurationService} from "../../ts/modules/base/conf"
import {StorageService} from "../../ts/modules/base/storage"

@Injectable()
export class AttachmentsResource {
    constructor(private urls: UrlsService,
                private http: HttpService,
                private config: ConfigurationService,
                private storage: StorageService) {}

    list(type, objectId, projectId) {
        let urlname = `attachments/${type}`;

        let params = {object_id: objectId, project: projectId};
        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        let url = this.urls.resolve(urlname);

        return this.http.get(url, params, httpOptions)
            .then((result:any) => Immutable.fromJS(result.data));
    };

    delete(type, id) {
        let urlname = `attachments/${type}`;

        let url = this.urls.resolve(urlname) + `/${id}`;

        return this.http.delete(url);
    };

    patch(type, id, patch) {
        let urlname = `attachments/${type}`;

        let url = this.urls.resolve(urlname) + `/${id}`;

        return this.http.patch(url, patch);
    };

    create(type, projectId, objectId, file, from_comment) {
        let response;
        let urlname = `attachments/${type}`;

        let url = this.urls.resolve(urlname);

        return new Promise(function(resolve, reject) {
            function uploadProgress(evt) {
                file.status = "in-progress";
                file.size = sizeFormat(evt.total);
                file.progressMessage = `upload ${sizeFormat(evt.loaded)} of ${sizeFormat(evt.total)}`;
                return file.progressPercent = `${Math.round((evt.loaded / evt.total) * 100)}%`;
            }

            function uploadComplete(evt) {
                let attachment;
                file.status = "done";

                let { status } = evt.target;
                try {
                    attachment = JSON.parse(evt.target.responseText);
                } catch (error) {
                    attachment = {};
                }

                if ((status >= 200) && (status < 400)) {
                    attachment = Immutable.fromJS(attachment);
                    return resolve(attachment);
                } else {
                    response = {
                        status,
                        data: {_error_message: (data['attached_file'] != null ? data['attached_file'][0] : undefined)}
                    };
                    return reject(response);
                }
            };

            function uploadFailed(evt) {
                file.status = "error";
                return reject("fail");
            };

            if (file === undefined) {
                return reject(null);
            }

            let maxFileSize = this.config.get("maxUploadFileSize", null);

            if (maxFileSize && (file.size > maxFileSize)) {
                response = {
                    status: 413,
                    data: { _error_message: `'${file.name}' (${sizeFormat(file.size)}) is too heavy for our oompa \
    loompas, try it with a smaller than (${sizeFormat(maxFileSize)})`
                }
                };
                return reject(response);
            }

            var data = new FormData();
            data.append("project", projectId);
            data.append("object_id", objectId);
            data.append("attached_file", file);
            data.append("from_comment", from_comment);

            let xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);

            let token = this.storage.get('token');

            xhr.open("POST", url);
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send(data);
        });
    };
};
