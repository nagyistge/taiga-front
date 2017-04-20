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

import {sizeFormat} from "../../ts/utils"
import * as _ from "lodash"
import * as Promise from "bluebird"
import * as Immutable from "immutable"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"
import {PaginateResponseService} from "../services/paginate-response.service"
import {TranslateService} from "@ngx-translate/core"
import {RepositoryService} from "../../ts/modules/base/repository"
import {ConfigurationService} from "../../ts/modules/base/conf"
import {StorageService} from "../../ts/modules/base/storage"

@Injectable()
export class ProjectsResource {
    constructor(private repo: RepositoryService,
                private translate: TranslateService,
                private urls: UrlsService,
                private http: HttpService,
                private storage: StorageService,
                private config: ConfigurationService,
                private paginateResponse: PaginateResponseService) {}

    get(projectId:number):any {
        return this.repo.queryOne("projects", projectId)
    }

    getBySlug(projectSlug:string):any {
        return this.repo.queryOne("projects", `by_slug?slug=${projectSlug}`);
    }

    list():any {
        return this.repo.queryMany("projects");
    }

    listByMember(memberId:number):any {
        let params = {"member": memberId, "order_by": "user_order"};
        return this.repo.queryMany("projects", params);
    }

    templates():any {
        return this.repo.queryMany("project-templates");
    }

    usersList(projectId:number):any {
        let params = {"project": projectId};
        return this.repo.queryMany("users", params);
    };

    rolesList(projectId:number):any {
        let params = {"project": projectId};
        return this.repo.queryMany("roles", params);
    }

    stats(projectId:number):any {
        return this.repo.queryOneRaw("projects", `${projectId}/stats`);
    }

    bulkUpdateOrder(bulkData:any):any {
        let url = this.urls.resolve("bulk-update-projects-order");
        return this.http.post(url, bulkData);
    }

    regenerate_epics_csv_uuid(projectId:number):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/regenerate_epics_csv_uuid`;
        return this.http.post(url);
    }

    regenerate_userstories_csv_uuid(projectId:number):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/regenerate_userstories_csv_uuid`;
        return this.http.post(url);
    }

    regenerate_tasks_csv_uuid(projectId:number):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/regenerate_tasks_csv_uuid`;
        return this.http.post(url);
    }

    regenerate_issues_csv_uuid(projectId:number):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/regenerate_issues_csv_uuid`;
        return this.http.post(url);
    }

    leave(projectId:number):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/leave`;
        return this.http.post(url);
    }

    memberStats(projectId:number):any {
        return this.repo.queryOneRaw("projects", `${projectId}/member_stats`);
    }

    tagsColors(projectId:number):any {
        return this.repo.queryOne("projects", `${projectId}/tags_colors`);
    }

    deleteTag(projectId:number, tag:string):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/delete_tag`;
        return this.http.post(url, {tag});
    }

    createTag(projectId:number, tag:string, color:string=null):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/create_tag`;
        let data = {tag, color}
        return this.http.post(url, data);
    };

    editTag(projectId:number, from_tag:string, to_tag:string, color:string=null):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/edit_tag`;
        let data:any = {from_tag, color};
        if (to_tag) {
            data.to_tag = to_tag;
        }
        return this.http.post(url, data);
    };

    mixTags(projectId:number, to_tag:string, from_tags:string[]):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/mix_tags`;
        return this.http.post(url, {to_tag, from_tags});
    };

    export(projectId:number):any {
        let url = `${this.urls.resolve("exporter")}/${projectId}`;
        return this.http.get(url);
    };

    import(file:any, statusUpdater:any):any {
        return new Promise(function(accept, reject) {
            let maxFileSize = this.config.get("maxUploadFileSize", null);
            if (maxFileSize && (file.size > maxFileSize)) {
                let errorMsg = this.translate.instant("PROJECT.IMPORT.ERROR_MAX_SIZE_EXCEEDED", {
                    fileName: file.name,
                    fileSize: sizeFormat(file.size),
                    maxFileSize: sizeFormat(maxFileSize)
                });

                let response = {
                    status: 413,
                    data: {_error_message: errorMsg}
                };
                reject(response);
            }

            function uploadProgress(evt) {
                let percent = Math.round((evt.loaded / evt.total) * 100);
                let message = this.translate.instant("PROJECT.IMPORT.UPLOAD_IN_PROGRESS_MESSAGE", {
                    uploadedSize: sizeFormat(evt.loaded),
                    totalSize: sizeFormat(evt.total)
                });
                return statusUpdater("in-progress", null, message, percent);
            }

            function uploadComplete(evt) {
                return statusUpdater("done",
                  this.translate.instant("PROJECT.IMPORT.TITLE"),
                  this.translate.instant("PROJECT.IMPORT.DESCRIPTION"));
            }

            function uploadFailed(evt) {
                return statusUpdater("error");
            }

            function complete(evt) {
                let response:any = {};
                try {
                    response.data = JSON.parse(evt.target.responseText);
                } catch (error) {
                    response.data = {};
                }
                response.status = evt.target.status;
                if (evt.target.getResponseHeader('Taiga-Info-Project-Is-Private')) {
                    response.headers = {
                        isPrivate: evt.target.getResponseHeader('Taiga-Info-Project-Is-Private') === 'True',
                        memberships: parseInt(evt.target.getResponseHeader('Taiga-Info-Project-Memberships'))
                    };
                }
                if (_.includes([201, 202], response.status)) { accept(response); }
                else { reject(response); }
            };

            function failed(evt) {
                reject("fail");
            };

            let data = new FormData();
            data.append('dump', file);

            let xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.upload.addEventListener("load", uploadComplete, false);
            xhr.upload.addEventListener("error", uploadFailed, false);
            xhr.upload.addEventListener("abort", uploadFailed, false);
            xhr.addEventListener("load", complete, false);
            xhr.addEventListener("error", failed, false);

            xhr.open("POST", this.urls.resolve("importer"));
            xhr.setRequestHeader("Authorization", `Bearer ${this.storage.get("token")}`);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send(data);
        });
    };

    changeLogo(projectId:number, file:any):any {
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
        data.append('logo', file);
        let options = {
            transformRequest: _.identity,
            headers: {'Content-Type': undefined}
        };
        let url = `${this.urls.resolve("projects")}/${projectId}/change_logo`;
        return this.http.post(url, data, {}, options);
    };

    removeLogo(projectId:number):any {
        let url = `${this.urls.resolve("projects")}/${projectId}/remove_logo`;
        return this.http.post(url);
    };

    create(data) {
        let url = this.urls.resolve('projects');

        return this.http.post(url, JSON.stringify(data))
            .map((result:any) => { return Immutable.fromJS(result.data); });
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

    getProjects(params={}, pagination=true):any {
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
            .map((result:any) => Immutable.fromJS(result.data));
    };

    getProjectsByUserId(userId, paginate=false) {
        let url = this.urls.resolve("projects");
        let httpOptions:any = {};

        if (!paginate) {
            httpOptions.headers = {
                "x-disable-pagination": "1"
            };
        }

        let params = {"member": userId, "order_by": "user_order"};

        return this.http.get(url, params, httpOptions)
            .map((result:any) => Immutable.fromJS(result.data));
    };

    getProjectStats(projectId) {
        let url = this.urls.resolve("projects");
        url = `${url}/${projectId}`;

        return this.http.get(url)
            .map((result:any) => Immutable.fromJS(result.data));
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
        }).map(function(result) {
            return this.paginateResponse.paginate(Immutable.fromJS({
                "data": result.data,
                "headers": result.headers
            }));
        }.bind(this));
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
