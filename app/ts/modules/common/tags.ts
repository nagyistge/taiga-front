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
 * File: modules/common/tags.coffee
 */

import {bindOnce, trim} from "../../utils"
import {Awesomplete} from "awesomplete"
import * as angular from "angular"
import * as _ from "lodash"
import {Component, Input} from "@angular/core"

// Directive that parses/format tags inputfield.

export let TagsDirective = function() {
    let formatter = function(v) {
        if (_.isArray(v)) {
            return v.join(", ");
        }
        return "";
    };

    let parser = function(v) {
        if (!v) { return []; }
        let result = _(v.split(",")).map(x => _.trim(x));

        return result.value();
    };

    let link = function($scope, $el, $attrs, $ctrl) {
        $ctrl.$formatters.push(formatter);
        $ctrl.$parsers.push(parser);

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        require: "ngModel",
        link
    };
};

//############################################################################
//# TagLine  Directive (for Lightboxes)
//############################################################################

export let LbTagLineDirective = function($rs, $template, $compile) {
    let ENTER_KEY = 13;
    let COMMA_KEY = 188;

    let templateTags = $template.get("common/tag/lb-tag-line-tags.html", true);

    let autocomplete = null;

    let link = function($scope, $el, $attrs, $model) {
        let withoutColors = _.has($attrs, "withoutColors");

        //# Render
        let renderTags = function(tags, tagsColors=[]) {
            let color = !withoutColors ? tagsColors : [];

            let ctx = {
                tags: _.map(tags, (t:string) => ({
                    name: t,
                    style: tagsColors[t] ? `border-left: 5px solid ${tagsColors[t]}` : ""
                }) )
            };

            let html = $compile(templateTags(ctx))($scope);
            return $el.find(".tags-container").html(html);
        };

        let showSaveButton = () => $el.find(".save").removeClass("hidden");

        let hideSaveButton = () => $el.find(".save").addClass("hidden");

        let resetInput = function() {
            $el.find("input").val("");
            return autocomplete.close();
        };

        //# Aux methods
        let addValue = function(value) {
            value = trim(value.toLowerCase());
            if (value.length === 0) { return; }

            let tags = _.clone($model.$modelValue);
            if ((tags == null)) { tags = []; }
            if (!tags.includes(value)) { tags.push(value); }

            $scope.$apply(() => $model.$setViewValue(tags));

            return hideSaveButton();
        };

        let deleteValue = function(value) {
            value = trim(value.toLowerCase());
            if (value.length === 0) { return; }

            let tags = _.clone($model.$modelValue);
            tags = _.pull(tags, value);

            return $scope.$apply(() => $model.$setViewValue(tags));
        };

        let saveInputTag = function() {
            let value = $el.find("input").val();

            addValue(value);
            return resetInput();
        };

        //# Events
        $el.on("keypress", "input", function(event) {
            let target = angular.element(event.currentTarget);

            if (event.keyCode === ENTER_KEY) {
                event.preventDefault();
                return saveInputTag();
            } else if (String.fromCharCode(event.keyCode) === ',') {
                event.preventDefault();
                return saveInputTag();
            } else {
                if (target.val().length) {
                    return showSaveButton();
                } else {
                    return hideSaveButton();
                }
            }
        });

        $el.on("click", ".save", function(event) {
            event.preventDefault();
            return saveInputTag();
        });

        $el.on("click", ".remove-tag", function(event) {
            event.preventDefault();
            let target = angular.element(event.currentTarget);

            let value = target.siblings(".tag-name").text();
            return deleteValue(value);
        });

        bindOnce($scope, "project", function(project) {
            let input = $el.find("input");

            autocomplete = new Awesomplete(input[0], {
                list: _.keys(project.tags_colors)
            });

            return input.on("awesomplete-selectcomplete", function() {
                addValue(input.val());
                return input.val("");
            });
        });

        $scope.$watch($attrs.ngModel, function(tags) {
            let tagsColors = ($scope.project != null ? $scope.project.tags_colors : undefined) || [];
            return renderTags(tags, tagsColors);
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        link,
        require:"ngModel",
        templateUrl: "common/tag/lb-tag-line.html"
    };
};
