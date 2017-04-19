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
 * File: home-project-list.directive.coffee
 */

import * as Immutable from "immutable"
import {defineImmutableProperty} from "../../../ts/utils"
import { CurrentUserService  } from "../../services/current-user.service";
import {Component, OnInit, Input} from "@angular/core"
import { ProjectsService } from "../../projects/projects.service";
import { ChangeDetectorRef } from "@angular/core";
import { ApplicationRef } from "@angular/core";

@Component({
    selector: "tg-home-project-list",
    template: require("./home-project-list.jade")(),
})
export class HomeProjectList{
    projects:any;

    constructor(private currentUser: CurrentUserService) {
        this.projects = Immutable.List();
        this.currentUser.projectsStream.subscribe((projects) => {
            console.log(projects);
            this.projects = projects;
        })
    }
};
