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
 * File: modules/wiki/pages-list.coffee
 */

import {PageMixin} from "../controllerMixins"
import * as angular from "angular"
import * as _ from "lodash"

//############################################################################
//# Wiki Pages List Controller
//############################################################################

export class WikiPagesListController extends PageMixin {
    scope: angular.IScope
    rs:any
    params:any
    q:any
    navUrls:any
    errorHandlingService:any
    projectService:any

    static initClass() {
        this.$inject = [
            "$scope",
            "$rootScope",
            "$tgRepo",
            "$tgModel",
            "$tgConfirm",
            "$tgResources",
            "$routeParams",
            "$q",
            "$tgNavUrls",
            "tgErrorHandlingService",
            "tgProjectService"
        ];
    }

    constructor(scope, rs, params, q,
                  navUrls, errorHandlingService, projectService) {
        super()
        this.scope = scope;
        this.rs = rs;
        this.params = params;
        this.q = q;
        this.navUrls = navUrls;
        this.errorHandlingService = errorHandlingService;
        this.projectService = projectService;
        this.scope.projectSlug = this.params.pslug;
        this.scope.wikiSlug = this.params.slug;
        this.scope.sectionName = "Wiki";
        this.scope.linksVisible = false;

        let promise = this.loadInitialData();

        // On Error
        promise.then(null, this.onInitialDataError.bind(this));
    }

    loadProject() {
        let project = this.projectService.project.toJS();

        if (!project.is_wiki_activated) {
            this.errorHandlingService.permissionDenied();
        }

        this.scope.projectId = project.id;
        this.scope.project = project;
        this.scope.$emit('project:loaded', project);

        return project;
    }

    loadWikiPages() {
        let promise;
        return promise = this.rs.wiki.list(this.scope.projectId).then(wikipages => {
            return this.scope.wikipages = wikipages;
        });
    }

    loadWikiLinks() {
        return this.rs.wiki.listLinks(this.scope.projectId).then(wikiLinks => {
            let selectedWikiLink;
            this.scope.wikiLinks = wikiLinks;

            let link:any;

            for (link of this.scope.wikiLinks) {
                link.url = this.navUrls.resolve("project-wiki-page", {
                    project: this.scope.projectSlug,
                    slug: link.href
                });
            }

            return selectedWikiLink = _.find(wikiLinks, {href: this.scope.wikiSlug});
        });
    }

    loadInitialData() {
        let project = this.loadProject();

        this.fillUsersAndRoles(project.members, project.roles);

        return this.q.all([this.loadWikiLinks(), this.loadWikiPages()]).then(this.checkLinksPerms.bind(this));
    }

    checkLinksPerms() {
        if ((this.scope.project.my_permissions.indexOf("add_wiki_link") !== -1) ||
          ((this.scope.project.my_permissions.indexOf("view_wiki_links") !== -1) && this.scope.wikiLinks.length)) {
            return this.scope.linksVisible = true;
        }
    }
}
WikiPagesListController.initClass();
