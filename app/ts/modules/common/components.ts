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
 * File: modules/common/components.coffee
 */

import {bindOnce} from "../../utils"
import * as Pikaday from "pikaday"
import * as angular from "angular"
import * as moment from "moment"
import * as _ from "lodash"
import {Component, OnChanges, Input} from "@angular/core"
import {TranslateService} from "@ngx-translate/core"

//############################################################################
//# Date Range Directive (used mainly for sprint date range)
//############################################################################

@Component({
    selector: "tg-date-range",
    template: "<span>{{formatedRange}}</span>",
})
export class DateRange implements OnChanges {
    @Input() first:string;
    @Input() second:string;
    formatedRange:string;

    constructor(private translate: TranslateService) {}

    ngOnChanges() {
        let prettyDate = this.translate.instant("BACKLOG.SPRINTS.DATE");
        let initDate = moment(this.first).format(prettyDate);
        let endDate = moment(this.second).format(prettyDate);
        this.formatedRange = `${initDate}-${endDate}`;
    }
}


//############################################################################
//# Date Selector Directive (using pikaday)
//############################################################################

export let DateSelectorDirective = function($rootscope, datePickerConfigService) {
    let link = function($scope, $el, $attrs, $model) {
        let selectedDate = null;

        let initialize = function() {
            let datePickerConfig = datePickerConfigService.get();

            _.merge(datePickerConfig, {
                field: $el[0]
            });

            return $el.picker = new Pikaday(datePickerConfig);
        };

        let unbind = $rootscope.$on("$translateChangeEnd", ctx => {
            if ($el.picker) { $el.picker.destroy(); }
            return initialize();
        });

        $attrs.$observe("pickerValue", function(val) {
            $el.val(val);

            if (val != null) {
                if ($el.picker) { $el.picker.destroy(); }
                initialize();
            }

            return $el.picker.setDate(val);
        });

        return $scope.$on("$destroy", function() {
            $el.off();
            unbind();
            return $el.picker.destroy();
        });
    };

    return {
        link
    };
};


//############################################################################
//# Sprint Progress Bar Directive
//############################################################################

export let SprintProgressBarDirective = function() {
    let renderProgress = function($el, percentage, visual_percentage) {
        if ($el.hasClass(".current-progress")) {
            return $el.css("width", `${percentage}%`);
        } else {
            $el.find(".current-progress").css("width", `${visual_percentage}%`);
            return $el.find(".number").html(`${percentage} %`);
        }
    };

    let link = function($scope, $el, $attrs) {
        bindOnce($scope, $attrs.tgSprintProgressbar, function(sprint) {
            let closedPoints = sprint.closed_points;
            let totalPoints = sprint.total_points;
            let percentage = 0;
            if (totalPoints !== 0) { percentage = Math.round(100 * (closedPoints/totalPoints)); }
            let visual_percentage = 0;
            //Visual hack for .current-progress bar
            if (totalPoints !== 0) { visual_percentage = Math.round(98 * (closedPoints/totalPoints)); }

            return renderProgress($el, percentage, visual_percentage);
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {link};
};


//############################################################################
//# Created-by display directive
//############################################################################

export let CreatedByDisplayDirective = function($template, $compile, $translate, $navUrls, avatarService){
    // Display the owner information (full name and photo) and the date of
    // creation of an object (like USs, tasks and issues).
    //
    // Example:
    //     div.us-created-by(tg-created-by-display, ng-model="us")
    //
    // Requirements:
    //   - model object must have the attributes 'created_date' and
    //     'owner'(ng-model)
    //   - scope.usersById object is required.

    let link = function($scope, $el, $attrs) {
        bindOnce($scope, $attrs.ngModel, function(model) {
            if (model != null) {

                let avatar = avatarService.getAvatar(model.owner_extra_info);
                $scope.owner = model.owner_extra_info || {
                    full_name_display: $translate.instant("COMMON.EXTERNAL_USER")
                };

                $scope.owner.avatar = avatar.url;
                $scope.owner.bg = avatar.bg;

                $scope.url = ($scope.owner != null ? $scope.owner.is_active : undefined) ? $navUrls.resolve("user-profile", {username: $scope.owner.username}) : "";


                return $scope.date =  moment(model.created_date).format($translate.instant("COMMON.DATETIME"));
            }
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        link,
        restrict: "EA",
        require: "ngModel",
        scope: true,
        templateUrl: "common/components/created-by.html"
    };
};


export let UserDisplayDirective = function($template, $compile, $translate, $navUrls, avatarService){
    // Display the user information (full name and photo).
    //
    // Example:
    //     div.creator(tg-user-display, tg-user-id="{{ user.id }}")
    //
    // Requirements:
    //   - scope.usersById object is required.

    let link = function($scope, $el, $attrs) {
        let id = $attrs.tgUserId;
        $scope.user = $scope.usersById[id] || {
            full_name_display: $translate.instant("COMMON.EXTERNAL_USER")
        };

        let avatar = avatarService.getAvatar($scope.usersById[id] || null);

        $scope.user.avatar = avatar.url;
        $scope.user.bg = avatar.bg;

        $scope.url = $scope.user.is_active ? $navUrls.resolve("user-profile", {username: $scope.user.username}) : "";

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        link,
        restrict: "EA",
        scope: true,
        templateUrl: "common/components/user-display.html"
    };
};


//############################################################################
//# Watchers directive
//############################################################################

export let WatchersDirective = function($rootscope, $confirm, $repo, $modelTransform, $template, $compile, $translate) {
    // You have to include a div with the tg-lb-watchers directive in the page
    // where use this directive

    let link = function($scope, $el, $attrs, $model) {
        let isEditable = () => __guard__($scope.project != null ? $scope.project.my_permissions : undefined, x => x.indexOf($attrs.requiredPerm)) !== -1;

        let save = function(watchers) {
            let transform = $modelTransform.save(function(item) {
                item.watchers = watchers;

                return item;
            });

            transform.then(function() {
                watchers = _.map(watchers, (watcherId:number) => $scope.usersById[watcherId]);
                renderWatchers(watchers);
                return $rootscope.$broadcast("object:updated");
            });

            return transform.then(null, () => $confirm.notify("error"));
        };

        let deleteWatcher = function(watcherIds) {
            let transform = $modelTransform.save(function(item) {
                item.watchers = watcherIds;

                return item;
            });

            transform.then(function() {
                let item = $modelTransform.getObj();
                let watchers = _.map(item.watchers, (watcherId:number) => $scope.usersById[watcherId]);
                renderWatchers(watchers);
                return $rootscope.$broadcast("object:updated");
            });

            return transform.then(null, function(item) {
                item.revert();
                return $confirm.notify("error");
            });
        };

        var renderWatchers = function(watchers) {
            $scope.watchers = watchers;
            return $scope.isEditable = isEditable();
        };

        $el.on("click", ".js-delete-watcher", function(event) {
            event.preventDefault();
            if (!isEditable()) { return; }
            let target = angular.element(event.currentTarget);
            let watcherId = target.data("watcher-id");

            let title = $translate.instant("COMMON.WATCHERS.TITLE_LIGHTBOX_DELETE_WARTCHER");
            let message = $scope.usersById[watcherId].full_name_display;

            return $confirm.askOnDelete(title, message).then(askResponse => {
                askResponse.finish();

                let watcherIds = _.clone($model.$modelValue.watchers);
                watcherIds = _.pull(watcherIds, watcherId);

                return deleteWatcher(watcherIds);
            });
        });

        $scope.$on("watcher:added", function(ctx, watcherId) {
            let watchers = _.clone($model.$modelValue.watchers);
            watchers.push(watcherId);
            watchers = _.uniq(watchers);

            return save(watchers);
        });

        $scope.$watch($attrs.ngModel, function(item) {
            if ((item == null)) { return; }
            let watchers = _.map(item.watchers, (watcherId:number) => $scope.usersById[watcherId]);
            watchers = _.filter(watchers, it => !!it);

            return renderWatchers(watchers);
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        scope: true,
        templateUrl: "common/components/watchers.html",
        link,
        require:"ngModel"
    };
};


//############################################################################
//# Assigned to directive
//############################################################################

export let AssignedToDirective = function($rootscope, $confirm, $repo, $loading, $modelTransform, $template, $translate, $compile, $currentUserService, avatarService) {
    // You have to include a div with the tg-lb-assignedto directive in the page
    // where use this directive
    let template = $template.get("common/components/assigned-to.html", true);

    let link = function($scope, $el, $attrs, $model) {
        let isEditable = () => __guard__($scope.project != null ? $scope.project.my_permissions : undefined, x => x.indexOf($attrs.requiredPerm)) !== -1;

        let save = function(userId) {
            let item = $model.$modelValue.clone();
            item.assigned_to = userId;

            let currentLoading = $loading()
                .target($el)
                .start();

            let transform = $modelTransform.save(function(item) {
                item.assigned_to = userId;

                return item;
            });

            transform.then(function() {
                currentLoading.finish();
                renderAssignedTo($modelTransform.getObj());
                return $rootscope.$broadcast("object:updated");
            });

            transform.then(null, function() {
                $confirm.notify("error");
                return currentLoading.finish();
            });

            return transform;
        };

        var renderAssignedTo = function(assignedObject) {
            let fullName, isUnassigned;
            let avatar = avatarService.getAvatar(assignedObject != null ? assignedObject.assigned_to_extra_info : undefined);
            let bg = null;

            if ((assignedObject != null ? assignedObject.assigned_to : undefined) != null) {
                fullName = assignedObject.assigned_to_extra_info.full_name_display;
                isUnassigned = false;
                ({ bg } = avatar);
            } else {
                fullName = $translate.instant("COMMON.ASSIGNED_TO.ASSIGN");
                isUnassigned = true;
            }

            let isIocaine = assignedObject != null ? assignedObject.is_iocaine : undefined;

            let ctx = {
                fullName,
                avatar: avatar.url,
                bg,
                isUnassigned,
                isEditable: isEditable(),
                isIocaine,
                fullNameVisible: !(isUnassigned && !$currentUserService.isAuthenticated())
            };
            let html = $compile(template(ctx))($scope);
            return $el.html(html);
        };

        $el.on("click", ".user-assigned", function(event) {
            event.preventDefault();
            if (!isEditable()) { return; }
            return $scope.$apply(() => $rootscope.$broadcast("assigned-to:add", $model.$modelValue));
        });

        $el.on("click", ".assign-to-me", function(event) {
            event.preventDefault();
            if (!isEditable()) { return; }
            $model.$modelValue.assigned_to = $currentUserService.getUser().get('id');
            return save($currentUserService.getUser().get('id'));
        });

        $el.on("click", ".remove-user", function(event) {
            event.preventDefault();
            if (!isEditable()) { return; }
            let title = $translate.instant("COMMON.ASSIGNED_TO.CONFIRM_UNASSIGNED");

            return $confirm.ask(title).then(response => {
                response.finish();
                $model.$modelValue.assigned_to  = null;
                return save(null);
            });
        });

        $scope.$on("assigned-to:added", function(ctx, userId, item) {
            if (item.id !== $model.$modelValue.id) { return; }

            return save(userId);
        });

        $scope.$watch($attrs.ngModel, instance => renderAssignedTo(instance));

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        link,
        require:"ngModel"
    };
};


//############################################################################
//# Block Button directive
//############################################################################

export let BlockButtonDirective = function($rootscope, $loading, $template) {
    let template = $template.get("common/components/block-button.html");

    let link = function($scope, $el, $attrs, $model) {
        let isEditable = () => $scope.project.my_permissions.indexOf("modify_us") !== -1;

        $scope.$watch($attrs.ngModel, function(item) {
            if (!item) { return; }

            if (isEditable()) {
                $el.find('.item-block').addClass('editable');
            }

            if (item.is_blocked) {
                $el.find('.item-block').removeClass('is-active');
                return $el.find('.item-unblock').addClass('is-active');
            } else {
                $el.find('.item-block').addClass('is-active');
                return $el.find('.item-unblock').removeClass('is-active');
            }
        });

        $el.on("click", ".item-block", function(event) {
            event.preventDefault();
            return $rootscope.$broadcast("block", $model.$modelValue);
        });

        $el.on("click", ".item-unblock", function(event) {
            event.preventDefault();
            let currentLoading = $loading()
                .target($el.find(".item-unblock"))
                .start();

            let finish = () => currentLoading.finish();

            return $rootscope.$broadcast("unblock", $model.$modelValue, finish);
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        link,
        restrict: "EA",
        require: "ngModel",
        template
    };
};


//############################################################################
//# Delete Button directive
//############################################################################

export let DeleteButtonDirective = function($log, $repo, $confirm, $location, $template) {
    let template = $template.get("common/components/delete-button.html");

    let link = function($scope, $el, $attrs, $model) {
        if (!$attrs.onDeleteGoToUrl) {
            return $log.error("DeleteButtonDirective requires on-delete-go-to-url set in scope.");
        }
        if (!$attrs.onDeleteTitle) {
            return $log.error("DeleteButtonDirective requires on-delete-title set in scope.");
        }

        $el.on("click", ".button-delete", function(event) {
            let title = $attrs.onDeleteTitle;
            let subtitle = $model.$modelValue.subject;

            return $confirm.askOnDelete(title, subtitle).then(askResponse => {
                let promise = $repo.remove($model.$modelValue);
                promise.then(() => {
                    askResponse.finish();
                    let url = $scope.$eval($attrs.onDeleteGoToUrl);
                    return $location.path(url);
                });
                return promise.then(null, () => {
                    askResponse.finish(false);
                    return $confirm.notify("error");
                });
            });
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        link,
        restrict: "EA",
        require: "ngModel",
        template
    };
};


//############################################################################
//# Editable subject directive
//############################################################################

export let EditableSubjectDirective = function($rootscope, $repo, $confirm, $loading, $modelTransform, $template) {
    let template = $template.get("common/components/editable-subject.html");

    let link = function($scope, $el, $attrs, $model) {

        $scope.$on("object:updated", function() {
            $el.find('.edit-subject').hide();
            return $el.find('.view-subject').show();
        });

        let isEditable = () => $scope.project.my_permissions.indexOf($attrs.requiredPerm) !== -1;

        let save = function(subject) {
            let currentLoading = $loading()
                .target($el.find('.save-container'))
                .start();

            let transform = $modelTransform.save(function(item) {

                item.subject  = subject;

                return item;
            });

            transform.then(() => {
                $confirm.notify("success");
                $rootscope.$broadcast("object:updated");
                $el.find('.edit-subject').hide();
                return $el.find('.view-subject').show();
            });

            transform.then(null, () => $confirm.notify("error"));

            transform.finally(() => currentLoading.finish());

            return transform;
        };

        $el.click(function() {
            if (!isEditable()) { return; }
            $el.find('.edit-subject').show();
            $el.find('.view-subject').hide();
            return $el.find('input').focus();
        });

        $el.on("click", ".save", function(e) {
            e.preventDefault();

            let { subject } = $scope.item;
            return save(subject);
        });

        $el.on("keyup", "input", function(event) {
            if (event.keyCode === 13) {
                let { subject } = $scope.item;
                return save(subject);
            } else if (event.keyCode === 27) {
                $scope.$apply(() => $model.$modelValue.revert());

                $el.find('.edit-subject').hide();
                return $el.find('.view-subject').show();
            }
        });

        $el.find('.edit-subject').hide();

        $scope.$watch($attrs.ngModel, function(value) {
            if (!value) { return; }
            $scope.item = value;

            if (!isEditable()) {
                return $el.find('.view-subject .edit').remove();
            }
        });

        return $scope.$on("$destroy", () => $el.off());
    };


    return {
        link,
        restrict: "EA",
        require: "ngModel",
        template
    };
};


//############################################################################
//# Common list directives
//############################################################################
//# NOTE: These directives are used in issues and search and are
//#       completely bindonce, they only serves for visualization of data.
//############################################################################

export let ListItemEpicStatusDirective = function() {
    let link = function($scope, $el, $attrs) {
        let epic = $scope.$eval($attrs.tgListitemEpicStatus);
        return bindOnce($scope, "epicStatusById", epicStatusById => $el.html(epicStatusById[epic.status].name));
    };

    return {link};
};


export let ListItemUsStatusDirective = function() {
    let link = function($scope, $el, $attrs) {
        let us = $scope.$eval($attrs.tgListitemUsStatus);
        return bindOnce($scope, "usStatusById", usStatusById => $el.html(usStatusById[us.status].name));
    };

    return {link};
};



export let ListItemTaskStatusDirective = function() {
    let link = function($scope, $el, $attrs) {
        let task = $scope.$eval($attrs.tgListitemTaskStatus);
        return bindOnce($scope, "taskStatusById", taskStatusById => $el.html(taskStatusById[task.status].name));
    };

    return {link};
};



export let ListItemAssignedtoDirective = function($template, $translate, avatarService) {
    let template = $template.get("common/components/list-item-assigned-to-avatar.html", true);

    let link = ($scope, $el, $attrs) =>
        bindOnce($scope, "usersById", function(usersById) {
            let item = $scope.$eval($attrs.tgListitemAssignedto);
            let ctx:any = {
                name: $translate.instant("COMMON.ASSIGNED_TO.NOT_ASSIGNED"),
            };

            let member = usersById[item.assigned_to];
            let avatar = avatarService.getAvatar(member);

            ctx.imgurl = avatar.url;
            ctx.bg = avatar.bg;

            if (member) {
                ctx.name = member.full_name_display;
            }

            return $el.html(template(ctx));
        })
    ;

    return {link};
};



export let ListItemIssueStatusDirective = function() {
    let link = function($scope, $el, $attrs) {
        let issue = $scope.$eval($attrs.tgListitemIssueStatus);
        return bindOnce($scope, "issueStatusById", issueStatusById => $el.html(issueStatusById[issue.status].name));
    };

    return {link};
};


export let ListItemTypeDirective = function() {
    let link = function($scope, $el, $attrs) {
        let render = function(issueTypeById, issue) {
            let type = issueTypeById[issue.type];
            let domNode = $el.find(".level");
            domNode.css("background-color", type.color);
            return domNode.attr("title", type.name);
        };

        bindOnce($scope, "issueTypeById", function(issueTypeById) {
            let issue = $scope.$eval($attrs.tgListitemType);
            return render(issueTypeById, issue);
        });

        return $scope.$watch($attrs.tgListitemType, issue => render($scope.issueTypeById, issue));
    };

    return {
        link,
        templateUrl: "common/components/level.html"
    };
};


export let ListItemPriorityDirective = function() {
    let link = function($scope, $el, $attrs) {
        let render = function(priorityById, issue) {
            let priority = priorityById[issue.priority];
            let domNode = $el.find(".level");
            domNode.css("background-color", priority.color);
            return domNode.attr("title", priority.name);
        };

        bindOnce($scope, "priorityById", function(priorityById) {
            let issue = $scope.$eval($attrs.tgListitemPriority);
            return render(priorityById, issue);
        });

        return $scope.$watch($attrs.tgListitemPriority, issue => render($scope.priorityById, issue));
    };

    return {
        link,
        templateUrl: "common/components/level.html"
    };
};


export let ListItemSeverityDirective = function() {
    let link = function($scope, $el, $attrs) {
        let render = function(severityById, issue) {
            let severity = severityById[issue.severity];
            let domNode = $el.find(".level");
            domNode.css("background-color", severity.color);
            return domNode.attr("title", severity.name);
        };

        bindOnce($scope, "severityById", function(severityById) {
            let issue = $scope.$eval($attrs.tgListitemSeverity);
            return render(severityById, issue);
        });

        return $scope.$watch($attrs.tgListitemSeverity, issue => render($scope.severityById, issue));
    };

    return {
        link,
        templateUrl: "common/components/level.html"
    };
};


//############################################################################
//# Progress bar directive
//############################################################################

export let TgProgressBarDirective = function($template) {
    let template = $template.get("common/components/progress-bar.html", true);

    let render = (el, percentage) => el.html(template({percentage}));

    let link = function($scope, $el, $attrs) {
        let element = angular.element($el);

        $scope.$watch($attrs.tgProgressBar, function(percentage) {
            percentage = _.max([0 , percentage]);
            percentage = _.min([100, percentage]);
            return render($el, percentage);
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {link};
};


function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
