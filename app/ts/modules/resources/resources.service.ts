import { Injectable } from "@angular/core"

import {UrlsService} from "../base/urls"

import {CustomAttributesResource} from "./custom-attributes"
import {CustomAttributesValuesResource} from "./custom-attributes-values"
import {EpicsResource} from "./epics"
import {HistoryResource} from "./history"
import {InvitationsResource} from "./invitations"
import {IssuesResource} from "./issues"
import {KanbanResource} from "./kanban"
import {LocalesResource} from "./locales"
import {MembershipsResource} from "./memberships"
import {ModulesResource} from "./modules"
import {NotifyPoliciesResource} from "./notify-policies"
import {ProjectsResource} from "./projects"
import {RolesResource} from "./roles"
import {SearchResource} from "./search"
import {SprintsResource} from "./sprints"
import {TasksResource} from "./tasks"
import {UserSettingsResource} from "./user-settings"
import {UserstoriesResource} from "./userstories"
import {UsersResource} from "./users"
import {WebhookLogsResource} from "./webhooklogs"
import {WebhooksResource} from "./webhooks"
import {WikiResource} from "./wiki"

import {AttachmentsResource} from "../../../modules/resources/attachments-resource.service"
import {EpicsResource} from "../../../modules/resources/epics-resource.service"
import {ExternalAppsResource} from "../../../modules/resources/external-apps-resource.service"
import {TrelloResource, JiraResource, GithubResource, AsanaResource} from "../../../modules/resources/importers-resource.service"
import {IssuesResource} from "../../../modules/resources/issues-resource.service"
import {ProjectsResource} from "../../../modules/resources/projects-resource.service"
import {StatsResource} from "../../../modules/resources/stats-resource.service"
import {TasksResource} from "../../../modules/resources/tasks-resource.service"
import {UserResource} from "../../../modules/resources/user-resource.service"
import {UsersResource} from "../../../modules/resources/users-resource.service"
import {UserstoriesResource} from "../../../modules/resources/userstories-resource.service"
import {WikiResource} from "../../../modules/resources/wiki-resource.service"

const urls = {
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

@Injectable()
export class ResourcesService {
    constructor(public customAttributes:CustomAttributesResource,
                public customAttributesValues:CustomAttributesValuesResource,
                public epics:EpicsResource,
                public history:HistoryResource,
                public invitations:InvitationsResource,
                public issues:IssuesResource,
                public kanban:KanbanResource,
                public locales:LocalesResource,
                public memberships:MembershipsResource,
                public modules:ModulesResource,
                public notifyPolicies:NotifyPoliciesResource,
                public projects:ProjectsResource,
                public roles:RolesResource,
                public search:SearchResource,
                public sprints:SprintsResource,
                public tasks:TasksResource,
                public userSettings:UserSettingsResource,
                public userstories:UserstoriesResource,
                public users:UsersResource,
                public webhookLogs:WebhookLogsResource,
                public webhooks:WebhooksResource,
                public wiki:WikiResource,
                private urls:UrlsService) {
        this.urls.update(urls);
    }
}
