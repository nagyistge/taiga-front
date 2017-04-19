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
 * File: modules/base.coffee
 */

import * as angular from "angular"
import * as bind from "./bind"
import {downgradeInjectable, downgradeComponent} from "@angular/upgrade/static"

import {ConfigurationService} from "./conf"
import {ContribUserSettingsController, ContribController} from "./contrib"
import {HttpService} from "./http"
import {locationFactory} from "./location"
import {ModelService} from "./model"
import {NavigationUrlsDirectiveNg1} from "./navurls.directive"
import {NavigationUrlsService} from "./navurls.service"
import {RepositoryService} from "./repository"
import {StorageService} from "./storage"
import {UrlsService} from "./urls"

let module = angular.module("taigaBase", []);
module.directive("tgBoBind", bind.BindOnceBindDirective);
module.directive("tgBoHtml", bind.BindOnceHtmlDirective);
module.directive("tgBoRef", bind.BindOnceRefDirective);
module.directive("tgBoSrc", bind.BindOnceSrcDirective);
module.directive("tgBoHref", bind.BindOnceHrefDirective);
module.directive("tgBoAlt", bind.BindOnceAltDirective);
module.directive("tgBoTitle", bind.BindOnceTitleDirective);
module.directive("tgBindTitle", bind.BindTitleDirective);
module.directive("tgBindHtml", bind.BindHtmlDirective);
module.service("$tgConfig", downgradeInjectable(ConfigurationService));
module.controller("ContribUserSettingsController", ContribUserSettingsController);
module.controller("ContribController", ContribController);
module.service("$tgHttp", downgradeInjectable(HttpService));
module.factory("$tgLocation", ["$location", "$route", "$rootScope", locationFactory]);
module.service("$tgModel", downgradeInjectable(ModelService));
module.service("$tgNavUrls", downgradeInjectable(NavigationUrlsService));
module.directive("tgNav", ["$tgNavUrls", "$tgAuth", "$q", "$tgLocation", "lightboxService", NavigationUrlsDirectiveNg1]);
module.service("$tgRepo", downgradeInjectable(RepositoryService));
module.service("$tgStorage", downgradeInjectable(StorageService));
module.service('$tgUrls', downgradeInjectable(UrlsService));

//############################################################################
//# Main Directive
//############################################################################

let TaigaMainDirective = function($rootscope, $window) {
    let link = ($scope, $el, $attrs) =>
        $window.onresize = () => $rootscope.$broadcast("resize")
    ;

    return {link};
};

module.directive("tgMain", ["$rootScope", "$window", TaigaMainDirective]);
