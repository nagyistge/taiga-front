/*
 * Copyright (C) 2014-2015 Taiga Agile LLC <taiga@taiga.io>
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
 * File: discover-search.controller.coffee
 */

import {defineImmutableProperty} from "../../../ts/utils"
import * as angular from "angular"
import * as _ from "lodash"

import {Component, OnInit} from "@angular/core"
import {ActivatedRoute, Router} from "@angular/router"
import {AppMetaService} from "../../services/app-meta.service"
import {DiscoverProjectsService} from "../services/discover-projects.service"
import {TranslateService} from "@ngx-translate/core"

@Component({
    selector: "tg-discover-search",
    template: require("./discover-search.jade")(),
})
export class DiscoverSearch implements OnInit {
    page:number
    q:any
    filter:any
    orderBy:any
    loadingGlobal:boolean
    loadingList:boolean
    loadingPagination:boolean

    constructor(private route: ActivatedRoute,
                private router: Router,
                private discoverProjects: DiscoverProjectsService,
                private appMetaService: AppMetaService,
                private translate: TranslateService) {
    }

    ngOnInit() {
        this.page = 1;

        this.route.queryParams.subscribe((params) => {
            this.q = params.text;
            this.filter = params.filter || 'all';
            this.orderBy = params.order_by || '';
        });
        this.loadingGlobal = false;
        this.loadingList = false;
        this.loadingPagination = false;

        let title = this.translate.instant("DISCOVER.SEARCH.PAGE_TITLE");
        let description = this.translate.instant("DISCOVER.SEARCH.PAGE_DESCRIPTION");
        this.appMetaService.setAll(title, description);

        defineImmutableProperty(this, "searchResult", () => { return this.discoverProjects.searchResult; });
        defineImmutableProperty(this, "nextSearchPage", () => { return this.discoverProjects.nextSearchPage; });
    }

    fetch() {
        this.page = 1;

        this.discoverProjects.resetSearchList();

        return this.search();
    }

    fetchByGlobalSearch() {
        if (this.loadingGlobal) { return; }

        this.loadingGlobal = true;

        return this.fetch().subscribe(() => this.loadingGlobal = false);
    }

    fetchByOrderBy() {
        if (this.loadingList) { return; }

        this.loadingList = true;

        return this.fetch().subscribe(() => this.loadingList = false);
    }

    showMore() {
        if (this.loadingPagination) { return; }

        this.loadingPagination = true;

        this.page++;

        return this.search().subscribe(() => this.loadingPagination = false);
    }

    search() {
        let filter = this.getFilter();

        let params = {
            page: this.page,
            q: this.q,
            order_by: this.orderBy
        };

        _.assign(params, filter);

        return this.discoverProjects.fetchSearch(params);
    }

    getFilter() {
        if (this.filter === 'people') {
            return {is_looking_for_people: true};
        } else if (this.filter === 'scrum') {
            return {is_backlog_activated: true};
        } else if (this.filter === 'kanban') {
            return {is_kanban_activated: true};
        }

        return {};
    }

    onChangeFilter(filter, q) {
        this.filter = filter;
        this.q = q;

        this.router.navigate([{
            filter: this.filter,
            text: this.q
        }]);

        return this.fetchByGlobalSearch();
    }

    onChangeOrder(orderBy) {
        this.orderBy = orderBy;

        this.router.navigate([{
            order_by: orderBy
        }]);

        return this.fetchByOrderBy();
    }
}
