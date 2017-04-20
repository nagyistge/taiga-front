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
 * File: modules/base/navurl.coffee
 */

import {trim, bindOnce} from "../../utils"
import * as _ from "lodash"
import {Directive, ElementRef, Input, HostListener} from "@angular/core"
import {Router} from "@angular/router"
import {AuthService} from "../auth"
import {LightboxService} from "../common/lightboxes"
import {NavigationUrlsService} from "./navurls.service"

//############################################################################
//# Navigation Urls Directive
//############################################################################

@Directive({
    selector: "[tg-nav]",
})
export class NavigationUrlsDirective {
    @Input() name: string;
    @Input() params: any;
    @Input("query-params") queryParams: any;
    fullUrl: string;

    constructor(private el: ElementRef,
                private navurls: NavigationUrlsService,
                private auth: AuthService,
                private router: Router) {
        this.fullUrl = null;
        if (this.el.nativeElement.nodeName === "A") {
            this.el.nativeElement.setAttribute("href", "#");
        }
    }

    @HostListener('mouseenter') onMouseEnter() {
        if (this.fullUrl) {
            return
        }
        this.fullUrl = this.navurls.resolve(this.name, this.params);

        if (this.queryParams) {
            let queryParamsStr = $.param(this.queryParams);
            this.fullUrl = `${this.fullUrl}?${queryParamsStr}`;
        }

        if (this.el.nativeElement.nodeName === "A") {
            this.el.nativeElement.setAttribute("href", this.fullUrl);
        }
        return true;
    }

    @HostListener('click') onClickEnter(event) {
        if (event.metaKey || event.ctrlKey) {
            return;
        }

        if (this.el.nativeElement.classList.contains('noclick')) {
            return;
        }

        switch (event.which) {
            case 1:
                this.router.navigate([this.fullUrl]);
                break;
            case 2:
                window.open(this.fullUrl);
                break;
        }

        // TODO
        //this.lightboxs.closeAll();
        return false;
    }
}
