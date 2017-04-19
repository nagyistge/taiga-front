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
 * File: modules/resources/sprints.coffee
 */

import * as _ from "lodash"
import {Injectable} from "@angular/core"
import {RepositoryService} from "../../ts/modules/base/repository"
import {ModelService} from "../../ts/modules/base/model"
import {StorageService} from "../../ts/modules/base/storage"

@Injectable()
export class SprintsResource {
    constructor(private repo: RepositoryService,
                private model: ModelService,
                private storage: StorageService) {}

    get(projectId, sprintId) {
        return this.repo.queryOne("milestones", sprintId).map((sprint:any) => {
            let uses = sprint.user_stories;
            uses = _.map(uses, u => this.model.make_model("userstories", u));
            sprint._attrs.user_stories = uses;
            return sprint;
        })
    }

    stats(projectId, sprintId) {
        this.repo.queryOneRaw("milestones", `${sprintId}/stats`);
    }

    list(projectId, filters) {
        let params = {"project": projectId};
        params = _.extend({}, params, filters || {});
        return this.repo.queryMany("milestones", params, {}, true).map(result => {
            let milestones = result[0];
            let headers = result[1];

            for (let m of milestones) {
                let uses = m.user_stories;
                uses = _.map(uses, u => this.model.make_model("userstories", u));
                m._attrs.user_stories = uses;
            }

            return {
                milestones,
                closed: parseInt(headers["Taiga-Info-Total-Closed-Milestones"], 10),
                open: parseInt(headers["Taiga-Info-Total-Opened-Milestones"], 10)
            };
        });
    };
};
