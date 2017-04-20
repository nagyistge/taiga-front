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
 * File: dropdown-user.directive.coffee
 */

import * as _ from "lodash"
import {defineImmutableProperty} from "../../../ts/utils"
import { GlobalDataService } from "../../services/global-data.service";
import { NavigationUrlsService } from "../../../ts/modules/base/navurls.service";
import { Router } from "@angular/router";
import { ConfigurationService } from "../../../ts/modules/base/conf";
import { AuthService } from "../../../ts/modules/auth";
import { Component, Input } from "@angular/core"
// import { FeedbackService } from "../../feedback/feedback.service";

@Component({
    selector: "tg-dropdown-user",
    template: require("./dropdown-user.jade")(),
})
export class DropdownUser {
    @Input() user: any;
    isFeedbackEnabled: boolean;
    // userSettingsPlugins:any;

    constructor (private config: ConfigurationService,
                 private router: Router,
                 private navurls: NavigationUrlsService) {
                 // private globalData: GlobalDataService) {
                 // private feedback: FeedbackService) {
        this.isFeedbackEnabled = this.config.get("feedbackEnabled");
        // this.userSettingsPlugins = _.filter(globalData.get('userSettingsPlugins'), {userMenu: true});
    }

    logout() {
        // this.auth.logout();
        // this.router.navigateByUrl(this.navurls.resolve("discover"));
    };

    sendFeedback() {
        // TODO: Implement feedback service that depends on lightbox factory
        // this.feedback.sendFeedback();
    }
};
