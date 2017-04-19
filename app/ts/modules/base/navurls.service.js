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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var utils_1 = require("../../utils");
var _ = require("lodash");
var core_1 = require("@angular/core");
//############################################################################
//# Navigation Urls Service
//############################################################################
var NavigationUrlsService = (function () {
    function NavigationUrlsService() {
        this.urls = {};
    }
    NavigationUrlsService.prototype.update = function (urls) {
        return this.urls = _.merge({}, this.urls, urls || {});
    };
    NavigationUrlsService.prototype.formatUrl = function (url, ctx) {
        if (ctx == null) {
            ctx = {};
        }
        var replacer = function (match) {
            match = utils_1.trim(match, ":");
            return ctx[match] || "undefined";
        };
        return url.replace(/(:\w+)/g, replacer);
    };
    NavigationUrlsService.prototype.resolve = function (name, ctx) {
        if (ctx === void 0) { ctx = {}; }
        var url = this.urls[name];
        if (!url) {
            return "";
        }
        if (ctx) {
            return this.formatUrl(url, ctx);
        }
        return url;
    };
    return NavigationUrlsService;
}());
NavigationUrlsService = __decorate([
    core_1.Injectable()
], NavigationUrlsService);
exports.NavigationUrlsService = NavigationUrlsService;
