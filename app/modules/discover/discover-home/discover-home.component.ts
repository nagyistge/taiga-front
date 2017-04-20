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
 * File: discover-home.controller.coffee
 */


import {Router} from "@angular/router"
import {NavigationUrlsService} from "../../../ts/modules/base/navurls.service"
import {AppMetaService} from "../../services/app-meta.service"
import {TranslateService} from "@ngx-translate/core"
import {Component, OnInit} from "@angular/core"
import {Store} from "@ngrx/store"
import {IState} from "../../../ts/app.store"

@Component({
    selector: "tg-discover-home",
    template: require("./discover-home.jade")(),
})
export class DiscoverHome implements OnInit {
    title: string;
    description: string;
    mostLikedProjects: any
    mostActiveProjects: any

    constructor(private store: Store<IState>,
                private router: Router,
                private navUrls: NavigationUrlsService,
                private appMetaService: AppMetaService,
                private translate: TranslateService) {
        let title = this.translate.instant("DISCOVER.PAGE_TITLE");
        let description = this.translate.instant("DISCOVER.PAGE_DESCRIPTION");
        this.appMetaService.setAll(title, description);

        this.mostLikedProjects = this.store.select((state) => state.getIn(['discover', 'most-liked']));
        this.mostActiveProjects = this.store.select((state) => state.getIn(['discover', 'most-active']));
    }

    ngOnInit() {
        this.store.dispatch({
            type: "FETCH_MOST_ACTIVE",
            payload: "last_week",
        });
        this.store.dispatch({
            type: "FETCH_MOST_LIKED",
            payload: "last_week",
        });
    }

    onMostActiveOrder(newOrder) {
        this.store.dispatch({
            type: "FETCH_MOST_ACTIVE",
            payload: `last_${newOrder}`,
        });
    }

    onMostLikedOrder(newOrder) {
        this.store.dispatch({
            type: "FETCH_MOST_LIKED",
            payload: `last_${newOrder}`,
        });
    }

    onSubmit(q) {
        let url = this.navUrls.resolve('discover-search');
        return this.router.navigateByUrl(url, [{text: q}]);
    }
}
