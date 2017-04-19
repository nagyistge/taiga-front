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
 * File: wiki-resource.service.coffee
 */

import * as Immutable from "immutable"

import {Injectable} from "@angular/core"
import {UrlsService} from "../../ts/modules/base/urls"
import {HttpService} from "../../ts/modules/base/http"
import {RepositoryService} from "../../ts/modules/base/repository"

@Injectable()
export class WikiHistoryResource {
    constructor(private repo: RepositoryService,
                private urls: UrlsService,
                private http: HttpService) {}

    get(wikiId) {
        return this.repo.queryOne("wiki", wikiId);
    }

    getBySlug(projectId, slug) {
        return this.repo.queryOne("wiki", `by_slug?project=${projectId}&slug=${slug}`);
    }

    list(projectId) {
        return this.repo.queryMany("wiki", {project: projectId});
    }

    listLinks(projectId) {
        return this.repo.queryMany("wiki-links", {project: projectId});
    }

    getWikiHistory(wikiId) {
        let url = this.urls.resolve("history/wiki", wikiId);

        let httpOptions = {
            headers: {
                "x-disable-pagination": "1"
            }
        };

        return this.http.get(url, null, httpOptions)
            .map((result:any) => Immutable.fromJS(result.data));
    };
};
