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
                this.router.navigateByUrl(this.fullUrl);
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

export let NavigationUrlsDirectiveNg1 = function($navurls, $auth, $q, $location, lightboxService) {
    // Example:
    // link(tg-nav="project-backlog:project='sss',")

    // bindOnce version that uses $q for offer
    // promise based api
    let bindOnceP = function($scope, attr) {
        let defered = $q.defer();
        bindOnce($scope, attr, v => defered.resolve(v));
        return defered.promise;
    };

    let parseNav = function(data, $scope) {
        let [name, params]:any[] = _.map(data.split(":"), trim);
        if (params) {
            // split by 'xxx='
            // example
            // project=vm.timeline.getIn(['data', 'project', 'slug']), ref=vm.timeline.getIn(['obj', 'ref'])
            // ["", "project", "vm.timeline.getIn(['data', 'project', 'slug']), ", "ref", "vm.timeline.getIn(['obj', 'ref'])"]
            let result = params.split(/(\w+)=/);

            // remove empty string
            result = _.filter(result, (str:string) => str.length);

            // remove , at the end of the string
            result = _.map(result, (str:string) => trim(str.replace(/,$/g, '')));

            params = [];
            let index = 0;

            // ['param1', 'value'] => [{'param1': 'value'}]
            while (index < result.length) {
                let obj = {};
                obj[result[index]] = result[index + 1];
                params.push(obj);
                index = index + 2;
            }
        } else {
            params = [];
        }

        let values = _.map(params, param => _.values(param)[0]);
        let promises = _.map(values, x => bindOnceP($scope, x));

        return $q.all(promises).then(function() {
            let options = {};
            for (let param of params) {
                let key = Object.keys(param)[0];
                let value = param[key];

                options[key] = $scope.$eval(value);
            }
            return [name, options];});
    };

    let link = function($scope, $el, $attrs) {
        if ($el.is("a")) {
            $el.attr("href", "#");
        }

        $el.on("mouseenter", function(event) {
            let target = $(event.currentTarget);

            if (!target.data("fullUrl") || ($attrs.tgNavGetParams !== target.data("params"))) {
                return parseNav($attrs.tgNav, $scope).then(function(result) {
                    let [name, options] = result;
                    let user = $auth.getUser();
                    if (user) { options.user = user.username; }

                    let fullUrl = $navurls.resolve(name, options);

                    if ($attrs.tgNavGetParams) {
                        let getURLParams = JSON.parse($attrs.tgNavGetParams);
                        let getURLParamsStr = $.param(getURLParams);
                        fullUrl = `${fullUrl}?${getURLParamsStr}`;

                        target.data("params", $attrs.tgNavGetParams);
                    }

                    target.data("fullUrl", fullUrl);

                    if (target.is("a")) {
                        target.attr("href", fullUrl);
                    }

                    return $el.on("click", function(event) {
                        if (event.metaKey || event.ctrlKey) {
                            return;
                        }

                        event.preventDefault();
                        target = $(event.currentTarget);

                        if (target.hasClass('noclick')) {
                            return;
                        }

                        fullUrl = target.data("fullUrl");

                        switch (event.which) {
                            case 1:
                                $location.url(fullUrl);
                                $scope.$apply();
                                break;
                            case 2:
                                window.open(fullUrl);
                                break;
                        }

                        return lightboxService.closeAll();
                    });
                });
            }
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {link};
};
