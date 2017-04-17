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
 * File: modules/resources.coffee
 */

import {Service} from "../../classes"
import * as angular from "angular"
import * as _ from "lodash"

import {CustomAttributesResourcesProvider} from "./custom-attributes"
import {CustomAttributesValuesResourcesProvider} from "./custom-attributes-values"
import {EpicsResourcesProvider} from "./epics"
import {HistoryResourcesProvider} from "./history"
import {InvitationsResourcesProvider} from "./invitations"
import {IssuesResourcesProvider} from "./issues"
import {KanbanResourcesProvider} from "./kanban"
import {LocalesResourcesProvider} from "./locales"
import {MembershipsResourcesProvider} from "./memberships"
import {ModulesResourcesProvider} from "./modules"
import {NotifyPoliciesResourcesProvider} from "./notify-policies"
import {ProjectsResourcesProvider} from "./projects"
import {RolesResourcesProvider} from "./roles"
import {SearchResourcesProvider} from "./search"
import {SprintsResourcesProvider} from "./sprints"
import {TasksResourcesProvider} from "./tasks"
import {UserSettingsResourcesProvider} from "./user-settings"
import {UserstoriesResourcesProvider} from "./userstories"
import {UsersResourcesProvider} from "./users"
import {WebhookLogsResourcesProvider} from "./webhooklogs"
import {WebhooksResourcesProvider} from "./webhooks"
import {WikiResourcesProvider} from "./wiki"

let module = angular.module("taigaResources", ["taigaBase"]);

module.factory("$tgCustomAttributesValuesResourcesProvider", ["$tgRepo", CustomAttributesValuesResourcesProvider]);
module.factory("$tgCustomAttributesResourcesProvider", ["$tgRepo", CustomAttributesResourcesProvider]);
module.factory("$tgEpicsResourcesProvider", ["$tgRepo","$tgHttp", "$tgUrls", "$tgStorage", EpicsResourcesProvider]);
module.factory("$tgHistoryResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", HistoryResourcesProvider]);
module.factory("$tgInvitationsResourcesProvider", ["$tgRepo", InvitationsResourcesProvider]);
module.factory("$tgIssuesResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", "$tgStorage", "$q", IssuesResourcesProvider]);
module.factory("$tgKanbanResourcesProvider", ["$tgStorage", KanbanResourcesProvider]);
module.factory("$tgLocalesResourcesProvider", ["$tgRepo", LocalesResourcesProvider]);
module.factory("$tgMembershipsResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", MembershipsResourcesProvider]);
module.factory("$tgModulesResourcesProvider", ["$tgRepo", ModulesResourcesProvider]);
module.factory("$tgNotifyPoliciesResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", NotifyPoliciesResourcesProvider]);
module.factory("$tgProjectsResourcesProvider", ["$tgConfig", "$tgRepo", "$tgHttp", "$tgUrls", "$tgAuth",
                                                "$q", "$translate", ProjectsResourcesProvider]);
module.factory("$tgRolesResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", RolesResourcesProvider]);
module.factory("$tgSearchResourcesProvider", ["$tgRepo", "$tgUrls", "$tgHttp", "$q", SearchResourcesProvider]);
module.factory("$tgSprintsResourcesProvider", ["$tgRepo", "$tgModel", "$tgStorage", SprintsResourcesProvider]);
module.factory("$tgTasksResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", "$tgStorage", TasksResourcesProvider]);
module.factory("$tgUserSettingsResourcesProvider", ["$tgConfig", "$tgRepo", "$tgHttp", "$tgUrls", "$q",
                                                    UserSettingsResourcesProvider]);
module.factory("$tgUserstoriesResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", "$tgStorage", "$q", UserstoriesResourcesProvider]);
module.factory("$tgUsersResourcesProvider", ["$tgHttp", "$tgUrls", "$q",
                                                    UsersResourcesProvider]);
module.factory("$tgWebhookLogsResourcesProvider", ["$tgRepo", "$tgUrls", "$tgHttp", WebhookLogsResourcesProvider]);
module.factory("$tgWebhooksResourcesProvider", ["$tgRepo", "$tgUrls", "$tgHttp", WebhooksResourcesProvider]);
module.factory("$tgWikiResourcesProvider", ["$tgRepo", "$tgHttp", "$tgUrls", WikiResourcesProvider]);

class ResourcesService extends Service {}
module.service("$tgResources", ResourcesService);

let urls = {
    // Auth
    "auth": "/auth",
    "auth-register": "/auth/register",
    "invitations": "/invitations",

    // User
    "users": "/users",
    "by_username": "/users/by_username",
    "users-password-recovery": "/users/password_recovery",
    "users-change-password-from-recovery": "/users/change_password_from_recovery",
    "users-change-password": "/users/change_password",
    "users-change-email": "/users/change_email",
    "users-cancel-account": "/users/cancel",
    "user-stats": "/users/%s/stats",
    "user-liked": "/users/%s/liked",
    "user-voted": "/users/%s/voted",
    "user-watched": "/users/%s/watched",
    "user-contacts": "/users/%s/contacts",
    "user-me": "/users/me",

    // User - Notification
    "permissions": "/permissions",
    "notify-policies": "/notify-policies",

    // User - Storage
    "user-storage": "/user-storage",

    // Memberships
    "memberships": "/memberships",
    "bulk-create-memberships": "/memberships/bulk_create",

    // Roles & Permissions
    "roles": "/roles",

    // Resolver
    "resolver": "/resolver",

    // Project
    "projects": "/projects",
    "project-templates": "/project-templates",
    "project-modules": "/projects/%s/modules",
    "bulk-update-projects-order": "/projects/bulk_update_order",
    "project-like": "/projects/%s/like",
    "project-unlike": "/projects/%s/unlike",
    "project-watch": "/projects/%s/watch",
    "project-unwatch": "/projects/%s/unwatch",
    "project-contact": "contact",
    "project-transfer-validate-token": "/projects/%s/transfer_validate_token",
    "project-transfer-accept": "/projects/%s/transfer_accept",
    "project-transfer-reject": "/projects/%s/transfer_reject",
    "project-transfer-request": "/projects/%s/transfer_request",
    "project-transfer-start": "/projects/%s/transfer_start",

    // Project Values - Choises
    "epic-statuses": "/epic-statuses",
    "userstory-statuses": "/userstory-statuses",
    "points": "/points",
    "task-statuses": "/task-statuses",
    "issue-statuses": "/issue-statuses",
    "issue-types": "/issue-types",
    "priorities": "/priorities",
    "severities": "/severities",

    // Milestones/Sprints
    "milestones": "/milestones",

    // Epics
    "epics": "/epics",
    "epic-upvote": "/epics/%s/upvote",
    "epic-downvote": "/epics/%s/downvote",
    "epic-watch": "/epics/%s/watch",
    "epic-unwatch": "/epics/%s/unwatch",
    "epic-related-userstories": "/epics/%s/related_userstories",
    "epic-related-userstories-bulk-create": "/epics/%s/related_userstories/bulk_create",

    // User stories
    "userstories": "/userstories",
    "bulk-create-us": "/userstories/bulk_create",
    "bulk-update-us-backlog-order": "/userstories/bulk_update_backlog_order",
    "bulk-update-us-milestone": "/userstories/bulk_update_milestone",
    "bulk-update-us-miles-order": "/userstories/bulk_update_sprint_order",
    "bulk-update-us-kanban-order": "/userstories/bulk_update_kanban_order",
    "userstories-filters": "/userstories/filters_data",
    "userstory-upvote": "/userstories/%s/upvote",
    "userstory-downvote": "/userstories/%s/downvote",
    "userstory-watch": "/userstories/%s/watch",
    "userstory-unwatch": "/userstories/%s/unwatch",

    // Tasks
    "tasks": "/tasks",
    "bulk-create-tasks": "/tasks/bulk_create",
    "bulk-update-task-taskboard-order": "/tasks/bulk_update_taskboard_order",
    "task-upvote": "/tasks/%s/upvote",
    "task-downvote": "/tasks/%s/downvote",
    "task-watch": "/tasks/%s/watch",
    "task-unwatch": "/tasks/%s/unwatch",
    "task-filters": "/tasks/filters_data",

    // Issues
    "issues": "/issues",
    "bulk-create-issues": "/issues/bulk_create",
    "issues-filters": "/issues/filters_data",
    "issue-upvote": "/issues/%s/upvote",
    "issue-downvote": "/issues/%s/downvote",
    "issue-watch": "/issues/%s/watch",
    "issue-unwatch": "/issues/%s/unwatch",

    // Wiki pages
    "wiki": "/wiki",
    "wiki-restore": "/wiki/%s/restore",
    "wiki-links": "/wiki-links",

    // History
    "history/epic": "/history/epic",
    "history/us": "/history/userstory",
    "history/issue": "/history/issue",
    "history/task": "/history/task",
    "history/wiki": "/history/wiki/%s",

    // Attachments
    "attachments/epic": "/epics/attachments",
    "attachments/us": "/userstories/attachments",
    "attachments/issue": "/issues/attachments",
    "attachments/task": "/tasks/attachments",
    "attachments/wiki_page": "/wiki/attachments",

    // Custom Attributess
    "custom-attributes/epic": "/epic-custom-attributes",
    "custom-attributes/userstory": "/userstory-custom-attributes",
    "custom-attributes/task": "/task-custom-attributes",
    "custom-attributes/issue": "/issue-custom-attributes",

    // Custom Attributess - Values
    "custom-attributes-values/epic": "/epics/custom-attributes-values",
    "custom-attributes-values/userstory": "/userstories/custom-attributes-values",
    "custom-attributes-values/task": "/tasks/custom-attributes-values",
    "custom-attributes-values/issue": "/issues/custom-attributes-values",

    // Webhooks
    "webhooks": "/webhooks",
    "webhooks-test": "/webhooks/%s/test",
    "webhooklogs": "/webhooklogs",
    "webhooklogs-resend": "/webhooklogs/%s/resend",

    // Reports - CSV
    "epics-csv": "/epics/csv?uuid=%s",
    "userstories-csv": "/userstories/csv?uuid=%s",
    "tasks-csv": "/tasks/csv?uuid=%s",
    "issues-csv": "/issues/csv?uuid=%s",

    // Timeline
    "timeline-profile": "/timeline/profile",
    "timeline-user": "/timeline/user",
    "timeline-project": "/timeline/project",

    // Search
    "search": "/search",

    // Export/Import
    "exporter": "/exporter",
    "importer": "/importer/load_dump",

    // Feedback
    "feedback": "/feedback",

    // locales
    "locales": "/locales",

    // Application tokens
    "applications": "/applications",
    "application-tokens": "/application-tokens",

    // Stats
    "stats-discover": "/stats/discover",

    // Importers
    "importers-trello-auth-url": "/importers/trello/auth_url",
    "importers-trello-authorize": "/importers/trello/authorize",
    "importers-trello-list-projects": "/importers/trello/list_projects",
    "importers-trello-list-users": "/importers/trello/list_users",
    "importers-trello-import-project": "/importers/trello/import_project",

    "importers-jira-auth-url": "/importers/jira/auth_url",
    "importers-jira-authorize": "/importers/jira/authorize",
    "importers-jira-list-projects": "/importers/jira/list_projects",
    "importers-jira-list-users": "/importers/jira/list_users",
    "importers-jira-import-project": "/importers/jira/import_project",

    "importers-github-auth-url": "/importers/github/auth_url",
    "importers-github-authorize": "/importers/github/authorize",
    "importers-github-list-projects": "/importers/github/list_projects",
    "importers-github-list-users": "/importers/github/list_users",
    "importers-github-import-project": "/importers/github/import_project",

    "importers-asana-auth-url": "/importers/asana/auth_url",
    "importers-asana-authorize": "/importers/asana/authorize",
    "importers-asana-list-projects": "/importers/asana/list_projects",
    "importers-asana-list-users": "/importers/asana/list_users",
    "importers-asana-import-project": "/importers/asana/import_project"
};

// Initialize api urls service
let initUrls = function($log, $urls) {
    $log.debug("Initialize api urls");
    return $urls.update(urls);
};

// Initialize resources service populating it with methods
// defined in separated files.
let initResources = function($log, $rs) {
    $log.debug("Initialize resources");
    let providers = _.toArray(arguments).slice(2);

    return providers.map((provider) =>
        provider($rs));
};

// Module entry point
module.run(["$log", "$tgUrls", initUrls]);
module.run([
    "$log",
    "$tgResources",
    "$tgProjectsResourcesProvider",
    "$tgCustomAttributesResourcesProvider",
    "$tgCustomAttributesValuesResourcesProvider",
    "$tgMembershipsResourcesProvider",
    "$tgNotifyPoliciesResourcesProvider",
    "$tgInvitationsResourcesProvider",
    "$tgRolesResourcesProvider",
    "$tgUserSettingsResourcesProvider",
    "$tgSprintsResourcesProvider",
    "$tgEpicsResourcesProvider",
    "$tgUserstoriesResourcesProvider",
    "$tgTasksResourcesProvider",
    "$tgIssuesResourcesProvider",
    "$tgWikiResourcesProvider",
    "$tgSearchResourcesProvider",
    "$tgMdRenderResourcesProvider",
    "$tgHistoryResourcesProvider",
    "$tgKanbanResourcesProvider",
    "$tgModulesResourcesProvider",
    "$tgWebhooksResourcesProvider",
    "$tgWebhookLogsResourcesProvider",
    "$tgLocalesResourcesProvider",
    "$tgUsersResourcesProvider",
    initResources
]);
