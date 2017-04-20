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
 * File: navigation-bar.directive.coffee
 */

import {defineImmutableProperty} from "../../ts/utils"
import {Component, OnInit, Input} from "@angular/core"
import { NavigationUrlsService } from "../../ts/modules/base/navurls.service";
import { ConfigurationService } from "../../ts/modules/base/conf";
import { CurrentUserService } from "../services/current-user.service";
import { NavigationBarService } from "./navigation-bar.service";
import { Router } from "@angular/router";

@Component({
    selector: "tg-navigation-bar",
    template: require("./navigation-bar.jade")(),
})
export class NavigationBar implements OnInit{
    @Input() projects: any;
    @Input() user:any
    isAuthenticated: any = true;
    isEnabledHeader:any = true;
    // publicRegisterEnabled: any;
    // active: boolean;

    constructor() {}
    // constructor(private navigationBarService: NavigationBarService,
    //             private router: Router,
    //             private navurls: NavigationUrlsService,
    //             private config: ConfigurationService) {
    //    }

    ngOnInit() {
        // console.log("INIT")
        // defineImmutableProperty(this, "projects", () => this.currentUser.projects.get("recents"));
        // defineImmutableProperty(this, "isAuthenticated", () => this.currentUser.isAuthenticated());
        // defineImmutableProperty(this, "isEnabledHeader", () => this.navigationBarService.isEnabledHeader());
        // this.publicRegisterEnabled = this.config.get("publicRegisterEnabled");
        //
        // // TODO: React to url change
        // if (this.router.url === "/") {
        //     return this.active = true;
        // } else {
        //     return this.active = false;
        // }
    }

    login() {
        // let nextUrl = encodeURIComponent(this.router.url);
        // this.router.navigateByUrl(this.navurls.resolve("login"), [{next: nextUrl}]);
    }
};
