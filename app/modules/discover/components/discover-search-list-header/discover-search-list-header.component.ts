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
 * File: discover-search-list-header.controller.coffee
 */

import * as angular from "angular"
import {Component, OnInit} from "@angular/core"

@Component({
    selector: 'tg-discover-search-list-header',
    templateUrl: 'discover/components/discover-search-list-header/discover-search-list-header.html'
})
export class DiscoverSearchListHeader implements OnInit {
    like_is_open:boolean
    activity_is_open:boolean
    orderBy:any
    onChange:any

    ngOnInit() {
        this.like_is_open = this.orderBy.indexOf('-total_fans') === 0;
        this.activity_is_open = this.orderBy.indexOf('-total_activity') === 0;
    }

    openLike() {
        this.like_is_open = true;
        this.activity_is_open = false;

        return this.setOrderBy('-total_fans_last_week');
    }

    openActivity() {
        this.activity_is_open = true;
        this.like_is_open = false;

        return this.setOrderBy('-total_activity_last_week');
    }

    setOrderBy(type) {
        if (type == null) { type = ''; }
        if (!type) {
            this.like_is_open = false;
            this.activity_is_open = false;
        }

        return this.onChange({orderBy: type});
    }
}
