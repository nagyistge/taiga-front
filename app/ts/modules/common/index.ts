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
 * File: modules/common.coffee
 */

import {Injectable, Component, Input, Output, ElementRef, EventEmitter} from "@angular/core"

import {Service} from "../../classes"
import * as angular from "angular"
import * as _ from "lodash"
declare var _version:string;
import {AnalyticsService} from "./analytics"
import {BindScope} from "./bind-scope"
import {CompileHtmlDirective} from "./compile-html.directive"
import * as commonComponents from "./components"
import {ConfirmService } from "./confirm"
import {CustomAttributesValuesDirective, CustomAttributeValueDirective} from "./custom-field-values"
import {LbUsEstimationDirective, UsEstimationDirective, EstimationsService} from "./estimation"
import * as commonFilters from "./filters"
import * as commonLightboxes from "./lightboxes"
import {LoaderDirective, Loader} from "./loader"
import {TgLoadingService, LoadingDirective} from "./loading"
import {UsStatusDirective, RelatedTaskStatusDirective} from "./popovers"
import {ExceptionHandlerFactory} from "./raven-logger"
import {TagsDirective, LbTagLineDirective} from "./tags"
import {ColorizeBacklogTags} from "./tags.component"
import {ProjectUrlService} from "./project-url.service"

export let module = angular.module("taigaCommon", []);

//############################################################################
//# Default datepicker config
//############################################################################
let DataPickerConfig = $translate =>
    ({
        get() {
            return {
                i18n: {
                    previousMonth: $translate.instant("COMMON.PICKERDATE.PREV_MONTH"),
                    nextMonth:  $translate.instant("COMMON.PICKERDATE.NEXT_MONTH"),
                    months: [
                        $translate.instant("COMMON.PICKERDATE.MONTHS.JAN"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.FEB"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.MAR"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.APR"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.MAY"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.JUN"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.JUL"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.AUG"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.SEP"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.OCT"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.NOV"),
                        $translate.instant("COMMON.PICKERDATE.MONTHS.DEC")
                    ],
                    weekdays: [
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.SUN"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.MON"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.TUE"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.WED"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.THU"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.FRI"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS.SAT")
                    ],
                    weekdaysShort: [
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.SUN"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.MON"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.TUE"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.WED"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.THU"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.FRI"),
                        $translate.instant("COMMON.PICKERDATE.WEEK_DAYS_SHORT.SAT")
                    ]
                },
                isRTL: $translate.instant("COMMON.PICKERDATE.IS_RTL") === "true",
                firstDay: parseInt($translate.instant("COMMON.PICKERDATE.FIRST_DAY_OF_WEEK"), 10),
                format: $translate.instant("COMMON.PICKERDATE.FORMAT")
            };
        }
    })
;

module.factory("tgDatePickerConfigService", ["$translate", DataPickerConfig]);

//############################################################################
//# Get the selected text
//############################################################################
let SelectedText = function($window, $document) {
    let get = function() {
        if ($window.getSelection) {
            return $window.getSelection().toString();
        } else if ($document.selection) {
            return $document.selection.createRange().text;
        }
        return "";
    };

    return {get};
};

module.factory("$selectedText", ["$window", "$document", SelectedText]);

//############################################################################
//# Permission directive, hide elements when necessary
//############################################################################

let CheckPermissionDirective = function(projectService) {
    let render = function($el, project, permission) {
        if (project && permission) {
            if (project.get('my_permissions').indexOf(permission) > -1) { return $el.removeClass('hidden'); }
        }
    };

    let link = function($scope, $el, $attrs) {
        $el.addClass('hidden');
        let permission = $attrs.tgCheckPermission;

        var unwatch = $scope.$watch(() => projectService.project
        , function() {
            if (!projectService.project) { return; }

            render($el, projectService.project, permission);
            return unwatch();
        });

        var unObserve = $attrs.$observe("tgCheckPermission", function(permission) {
            if (!permission) { return; }

            render($el, projectService.project, permission);
            return unObserve();
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {link};
};

CheckPermissionDirective.$inject = [
    "tgProjectService"
];

module.directive("tgCheckPermission", CheckPermissionDirective);

//############################################################################
//# Add class based on permissions
//############################################################################

let ClassPermissionDirective = function() {
    let name = "tgClassPermission";

    let link = function($scope, $el, $attrs) {
        let unbindWatcher;
        let checkPermissions = function(project, className, permission) {
            let negation = permission[0] === "!";

            if (negation) { permission = permission.slice(1); }

            if (negation && (project.my_permissions.indexOf(permission) === -1)) {
                return $el.addClass(className);
            } else if (!negation && (project.my_permissions.indexOf(permission) !== -1)) {
                return $el.addClass(className);
            } else {
                return $el.removeClass(className);
            }
        };

        let tgClassPermissionWatchAction = function(project) {
            if (project) {
                unbindWatcher();

                let classes = $scope.$eval($attrs[name]);

                return (() => {
                    let result = [];
                    for (let className in classes) {
                        let permission = classes[className];
                        result.push(checkPermissions(project, className, permission));
                    }
                    return result;
                })();
            }
        };


        return unbindWatcher = $scope.$watch("project", tgClassPermissionWatchAction);
    };

    return {link};
};

module.directive("tgClassPermission", ClassPermissionDirective);

//############################################################################
//# Animation frame service, apply css changes in the next render frame
//############################################################################
let AnimationFrame = function() {
    let fn;
    let animationFrame =
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        (<any>window).mozRequestAnimationFrame;

    var performAnimation = time => {
        fn = tail.shift();
        fn();

        if (tail.length) {
            return animationFrame(performAnimation);
        }
    };

    var tail = [];

    let add = function(...args) {
        return (() => {
            let result = [];
            for (fn of args) {
                let item;
                tail.push(fn);

                if (tail.length === 1) {
                    item = animationFrame(performAnimation);
                }
                result.push(item);
            }
            return result;
        })();
    };

    return {add};
};

module.factory("animationFrame", AnimationFrame);

//############################################################################
//# Open/close comment
//############################################################################

let ToggleCommentDirective = function() {
    let link = ($scope, $el, $attrs) =>
        $el.find("textarea").on("focus", () => $el.addClass("active"))
    ;

    return {link};
};

module.directive("tgToggleComment", ToggleCommentDirective);


//############################################################################
//# Get the appropiate section url for a project
//# according to his enabled modules and user permisions
//############################################################################


//############################################################################
//# Queue Q promises
//############################################################################

let Qqueue = function($q) {
    let deferred = $q.defer();
    deferred.resolve();

    let lastPromise = deferred.promise;

    var qqueue = {
        bindAdd: fn => {
            return (...args) => {
                return lastPromise = lastPromise.then(() => fn.apply(this, args));
            };
        },
        add: fn => {
            if (!lastPromise) {
                lastPromise = fn();
            } else {
                lastPromise = lastPromise.then(fn);
            }

            return qqueue;
        }
    };

    return qqueue;
};

module.factory("$tgQqueue", ["$q", Qqueue]);


//############################################################################
//# Queue model transformation
//############################################################################

class QueueModelTransformation extends Service {
    scope: angular.IScope
    prop:any
    qqueue:any
    repo:any
    q:any
    model:any

    static initClass() {
        this.$inject = [
            "$tgQqueue",
            "$tgRepo",
            "$q",
            "$tgModel"
        ];
    }

    constructor(qqueue, repo, q, model) {
        super()
        this.qqueue = qqueue;
        this.repo = repo;
        this.q = q;
        this.model = model;
    }

    setObject(scope, prop) {
        this.scope = scope;
        this.prop = prop;
    }

    clone() {
        let attrs = _.cloneDeep(this.scope[this.prop]._attrs);
        let model = this.model.make_model(this.scope[this.prop]._name, attrs);

        return model;
    }

    getObj() {
        return this.scope[this.prop];
    }

    save(transformation) {
        let defered = this.q.defer();

        this.qqueue.add(() => {
            let obj = this.getObj();
            let { comment } = obj;

            obj.comment = '';

            let clone = this.clone();

            let modified = _.omit(obj._modifiedAttrs, ['version']);
            clone = _.assign(clone, modified);

            transformation(clone);

            if (comment.length) {
                clone.comment = comment;
            }

            let success = function() {
                this.scope[this.prop] = clone;

                return defered.resolve.apply(null, arguments);
            }.bind(this);

            return this.repo.save(clone).then(success, defered.reject);
        });

        return defered.promise;
    }
}
QueueModelTransformation.initClass();

module.service("$tgQueueModelTransformation", QueueModelTransformation);

//############################################################################
//# Templates
//############################################################################

let Template = $templateCache =>
    ({
        get: (name, lodash) => {
            if (lodash == null) { lodash = false; }
            let tmp = $templateCache.get(name);

            if (lodash) {
                tmp = _.template(tmp);
            }

            return tmp;
        }
    })
;

module.factory("$tgTemplate", ["$templateCache", Template]);

//############################################################################
//# Permission directive, hide elements when necessary
//############################################################################

let Capslock = function() {
    let template = `\
<tg-svg class="capslock" ng-if="capslockIcon && iscapsLockActivated" svg-icon='icon-capslock' svg-title='COMMON.CAPSLOCK_WARNING'></tg-svg>\
`;

    return {
        template
    };
};

module.directive("tgCapslock", [Capslock]);

@Component({
    selector: "tg-lightbox-close",
    template: `
        <a class="close" ng-click="close()" href="" title="{{'COMMON.CLOSE' | translate}}">
            <tg-svg svg-icon="icon-close"></tg-svg>
        </a>`
})
export class LightboxClose {
    @Output("on-close") onClose = new EventEmitter();

    close() {
        this.onClose.emit()
    }
}

@Component({
    selector: "tg-svg",
    template: `
      <svg [ngClass]="['icon', svgIcon]">
          <use [attr.xlink:href]="'#' + svgIcon">
              <title *ngIf="svgTitle">{{svgTitle}}</title>
              <title *ngIf="svgTitleTranslate" i18n>{{svgTitleTranslate}}</title>
          </use>
      </svg>
    `
})
export class Svg {
    @Input("svg-icon") svgIcon: string = "";
    @Input("svg-title") svgTitle: string = "";
    @Input("svg-title-translate") svgTitleTranslate: string = "";

    constructor(elm: ElementRef) {
        this.svgIcon = elm.nativeElement.getAttribute('svg-icon');
        this.svgTitle = elm.nativeElement.getAttribute('svg-title');
        this.svgTitleTranslate = elm.nativeElement.getAttribute('svg-title-translate');
    }
};

let Autofocus = ($timeout, $parse, animationFrame) =>
  ({
    restrict: 'A',
    link($scope, $element, attrs) {
        if (attrs.ngShow) {
            let model = $parse(attrs.ngShow);

            return $scope.$watch(model, function(value) {
                if (value === true) {
                    return $timeout(() => $element[0].focus());
                }
            });

        } else {
            return $timeout(() => $element[0].focus());
        }
    }
  })
;

module.directive('tgAutofocus', ['$timeout', '$parse', "animationFrame", Autofocus]);

module.directive('tgPreloadImage', function() {
    let spinner = `<img class='loading-spinner' src='/${_version}/svg/spinner-circle.svg' alt='loading...' />`;

    let template = `\
<div>
    <ng-transclude></ng-transclude>
</div>\
`;

    let preload = function(src, onLoad) {
        let image = new Image();
        image.onload = onLoad;
        image.src = src;

        return image;
    };

    return {
        template,
        transclude: true,
        replace: true,
        link(scope, el, attrs) {
            let image = el.find('img:last');
            let timeout = null;

            let onLoad = function() {
                el.find('.loading-spinner').remove();
                image.show();

                if (timeout) {
                    clearTimeout(timeout);
                    return timeout = null;
                }
            };

            return attrs.$observe('preloadSrc', function(src) {
                if (timeout) {
                    clearTimeout(timeout);
                }

                el.find('.loading-spinner').remove();

                timeout = setTimeout(() => el.prepend(spinner)
                , 200);

                image.hide();

                return preload(src, onLoad);
            });
        }
    };
});
