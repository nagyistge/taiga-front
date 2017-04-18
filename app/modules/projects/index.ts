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
 * File: projects.module.coffee
 */

import * as angular from "angular"
import {downgradeInjectable} from "@angular/upgrade/static"

import {BlockedProjectExplanationDirective} from "./components/blocked-project-explanation.directive"
import {ContactProjectButtonController} from "./components/contact-project-button/contact-project-button.controller"
import {ContactProjectButtonDirective} from "./components/contact-project-button/contact-project-button.directive"
import {ContactProjectLbController} from "./components/lb-contact-project/lb-contact-project.controller"
import {ContactProjectLbDirective} from "./components/lb-contact-project/lb-contact-project.directive"
import {LikeProjectButtonController} from "./components/like-project-button/like-project-button.controller"
import {LikeProjectButtonDirective} from "./components/like-project-button/like-project-button.directive"
import {LikeProjectButtonService} from "./components/like-project-button/like-project-button.service"
import {SortProjectsDirective} from "./components/sort-projects.directive"
import {WatchProjectButtonController} from "./components/watch-project-button/watch-project-button.controller"
import {WatchProjectButtonDirective} from "./components/watch-project-button/watch-project-button.directive"
import {WatchProjectButtonService} from "./components/watch-project-button/watch-project-button.service"
import {AsanaImportController} from "./create/asana-import/asana-import.controller"
import {AsanaImportDirective} from "./create/asana-import/asana-import.directive"
import {AsanaImportProjectFormController} from "./create/asana-import/asana-import-project-form/asana-import-project-form.controller"
import {AsanaImportProjectFormDirective} from "./create/asana-import/asana-import-project-form/asana-import-project-form.directive"
import {AsanaImportService} from "./create/asana-import/asana-import.service"
import {CreateProjectController} from "./create/create-project.controller"
import {CreatetProjectFormController} from "./create/create-project-form/create-project-form.controller"
import {CreateProjectFormDirective} from "./create/create-project-form/create-project-form.directive"
import {createProjectMembersRestrictionsDirective} from "./create/create-project-members-restrictions/create-project-members-restrictions.directive"
import {createProjectRestrictionsDirective} from "./create/create-project-restrictions/create-project-restrictions.directive"
import {DuplicateProjectController} from "./create/duplicate/duplicate-project.controller"
import {DuplicateProjectDirective} from "./create/duplicate/duplicate-project.directive"
import {GithubImportController} from "./create/github-import/github-import.controller"
import {GithubImportDirective} from "./create/github-import/github-import.directive"
import {GithubImportProjectFormController} from "./create/github-import/github-import-project-form/github-import-project-form.controller"
import {GithubImportProjectFormDirective} from "./create/github-import/github-import-project-form/github-import-project-form.directive"
import {GithubImportService} from "./create/github-import/github-import.service"
import {ImportProjectController} from "./create/import/import-project.controller"
import {ImportProjectDirective} from "./create/import/import-project.directive"
import {LbImportErrorDirective} from "./create/import/import-project-error-lb.directive"
import {ImportProjectService} from "./create/import/import-project.service"
import {ImportProjectMembersController} from "./create/import-project-members/import-project-members.controller"
import {ImportProjectMembersDirective} from "./create/import-project-members/import-project-members.directive"
import {ImportProjectSelectorController} from "./create/import-project-selector/import-project-selector.controller"
import {ImportProjectSelectorDirective} from "./create/import-project-selector/import-project-selector.directive"
import {ImportTaigaController} from "./create/import-taiga/import-taiga.controller"
import {ImportTaigaDirective} from "./create/import-taiga/import-taiga.directive"
import {InviteMembersController} from "./create/invite-members/invite-members.controller"
import {InviteMembersDirective} from "./create/invite-members/invite-members.directive"
import {SingleMemberDirective} from "./create/invite-members/single-member/single-member.directive"
import {JiraImportController} from "./create/jira-import/jira-import.controller"
import {JiraImportDirective} from "./create/jira-import/jira-import.directive"
import {JiraImportProjectFormController} from "./create/jira-import/jira-import-project-form/jira-import-project-form.controller"
import {JiraImportProjectFormDirective} from "./create/jira-import/jira-import-project-form/jira-import-project-form.directive"
import {JiraImportService} from "./create/jira-import/jira-import.service"
import {SelectImportUserLightboxCtrl} from "./create/select-import-user-lightbox/select-import-user-lightbox.controller"
import {SelectImportUserLightboxDirective} from "./create/select-import-user-lightbox/select-import-user-lightbox.directive"
import {TrelloImportController} from "./create/trello-import/trello-import.controller"
import {TrelloImportDirective} from "./create/trello-import/trello-import.directive"
import {TrelloImportProjectFormController} from "./create/trello-import/trello-import-project-form/trello-import-project-form.controller"
import {TrelloImportProjectFormDirective} from "./create/trello-import/trello-import-project-form/trello-import-project-form.directive"
import {TrelloImportService} from "./create/trello-import/trello-import.service"
import {WarningUserImportDirective} from "./create/warning-user-import-lightbox/warning-user-import-lightbox.directive"
import {ProjectsListingController} from "./listing/projects-listing.controller"
import {ProjectController} from "./project/project.controller"
import {ProjectsService} from "./projects.service"
import {CantOwnProjectExplanationDirective} from "./transfer/cant-own-project-explanation.directive"
import {TransferProject} from "./transfer/transfer-project.controller"
import {TransferProjectDirective} from "./transfer/transfer-project.directive"

let module = angular.module("taigaProjects", []);
module.directive("tgBlockedProjectExplanation", BlockedProjectExplanationDirective);
module.controller("ContactProjectButtonCtrl", ContactProjectButtonController);
module.directive("tgContactProjectButton", ContactProjectButtonDirective);
module.controller("ContactProjectLbCtrl", ContactProjectLbController);
module.directive("tgLbContactProject", ["lightboxService", ContactProjectLbDirective]);
module.controller("LikeProjectButton", LikeProjectButtonController);
module.directive("tgLikeProjectButton", LikeProjectButtonDirective);
module.service("tgLikeProjectButtonService", LikeProjectButtonService);
module.directive("tgSortProjects", ["tgCurrentUserService", SortProjectsDirective]);
module.controller("WatchProjectButton", WatchProjectButtonController);
module.directive("tgWatchProjectButton", WatchProjectButtonDirective);
module.service("tgWatchProjectButtonService", WatchProjectButtonService);
module.controller('AsanaImportCtrl', AsanaImportController);
module.directive("tgAsanaImport", AsanaImportDirective);
module.controller('AsanaImportProjectFormCtrl', AsanaImportProjectFormController);
module.directive("tgAsanaImportProjectForm", AsanaImportProjectFormDirective);
module.service("tgAsanaImportService", AsanaImportService);
module.controller("CreateProjectCtrl", CreateProjectController);
module.controller('CreateProjectFormCtrl', CreatetProjectFormController);
module.directive("tgCreateProjectForm", CreateProjectFormDirective);
module.directive('tgCreateProjectMembersRestrictions', [createProjectMembersRestrictionsDirective]);
module.directive('tgCreateProjectRestrictions', [createProjectRestrictionsDirective]);
module.controller("DuplicateProjectCtrl", DuplicateProjectController);
module.directive("tgDuplicateProject", DuplicateProjectDirective);
module.controller('GithubImportCtrl', GithubImportController);
module.directive("tgGithubImport", GithubImportDirective);
module.controller('GithubImportProjectFormCtrl', GithubImportProjectFormController);
module.directive("tgGithubImportProjectForm", GithubImportProjectFormDirective);
module.service("tgGithubImportService", GithubImportService);
module.controller("ImportProjectCtrl", ImportProjectController);
module.directive("tgImportProject", ImportProjectDirective);
module.directive("tgLbImportError", LbImportErrorDirective);
module.service("tgImportProjectService", ImportProjectService);
module.controller('ImportProjectMembersCtrl', ImportProjectMembersController);
module.directive("tgImportProjectMembers", ImportProjectMembersDirective);
module.controller('ImportProjectSelectorCtrl', ImportProjectSelectorController);
module.directive("tgImportProjectSelector", ImportProjectSelectorDirective);
module.controller("ImportTaigaCtrl", ImportTaigaController);
module.directive("tgImportTaiga", ImportTaigaDirective);
module.controller("InviteMembersCtrl", InviteMembersController);
module.directive("tgInviteMembers", InviteMembersDirective);
module.directive("tgSingleMember", SingleMemberDirective);
module.controller('JiraImportCtrl', JiraImportController);
module.directive("tgJiraImport", JiraImportDirective);
module.controller('JiraImportProjectFormCtrl', JiraImportProjectFormController);
module.directive("tgJiraImportProjectForm", JiraImportProjectFormDirective);
module.service("tgJiraImportService", JiraImportService);
module.controller('SelectImportUserLightboxCtrl', SelectImportUserLightboxCtrl);
module.directive("tgSelectImportUserLightbox", SelectImportUserLightboxDirective);
module.controller('TrelloImportCtrl', TrelloImportController);
module.directive("tgTrelloImport", TrelloImportDirective);
module.controller('TrelloImportProjectFormCtrl', TrelloImportProjectFormController);
module.directive("tgTrelloImportProjectForm", TrelloImportProjectFormDirective);
module.service("tgTrelloImportService", TrelloImportService);
module.directive("tgWarningUserImportLightbox", WarningUserImportDirective);
module.controller("ProjectsListing", ProjectsListingController);
module.controller("Project", ProjectController);
module.service("tgProjectsService", downgradeInjectable(ProjectsService));
module.directive("tgCantOwnProjectExplanation", CantOwnProjectExplanationDirective);
module.controller("TransferProjectController", TransferProject);
module.directive('tgTransferProject', TransferProjectDirective);
