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
 * File: discover-home-order-by.controller.coffee
 */

import {TranslateService} from "@ngx-translate/core"
import {Component, OnInit, Output, Input, EventEmitter} from "@angular/core"

@Component({
    selector: 'tg-discover-home-order-by',
    template: require('./discover-home-order-by.jade')()
})
export class DiscoverHomeOrderBy implements OnInit{
    @Output() order: EventEmitter<any>;
    currentOrderBy: any;
    isOpen:boolean;
    texts:any

    constructor(private translate: TranslateService) {
        this.order = new EventEmitter();
        this.texts = {
            week: this.translate.instant('DISCOVER.FILTERS.WEEK'),
            month: this.translate.instant('DISCOVER.FILTERS.MONTH'),
            year: this.translate.instant('DISCOVER.FILTERS.YEAR'),
            all: this.translate.instant('DISCOVER.FILTERS.ALL_TIME')
        };
    }

    ngOnInit() {
        this.isOpen = false;
        this.currentOrderBy = "week"
    }

    currentText() {
        return this.texts[this.currentOrderBy];
    }

    open() {
        return this.isOpen = true;
    }

    close() {
        return this.isOpen = false;
    }

    orderBy(type) {
        this.currentOrderBy = type;
        this.isOpen = false;
        this.order.emit(type);
    }
}
