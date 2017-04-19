"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ProjectUrlService = (function () {
    function ProjectUrlService(navurls) {
        this.navurls = navurls;
    }
    ProjectUrlService.prototype.get = function (project) {
        if (project.toJS) {
            project = project.toJS();
        }
        var ctx = { project: project.slug };
        if (project.is_backlog_activated && (project.my_permissions.indexOf("view_us") > -1)) {
            return this.navurls.resolve("project-backlog", ctx);
        }
        if (project.is_kanban_activated && (project.my_permissions.indexOf("view_us") > -1)) {
            return this.navurls.resolve("project-kanban", ctx);
        }
        if (project.is_wiki_activated && (project.my_permissions.indexOf("view_wiki_pages") > -1)) {
            return this.navurls.resolve("project-wiki", ctx);
        }
        if (project.is_issues_activated && (project.my_permissions.indexOf("view_issues") > -1)) {
            return this.navurls.resolve("project-issues", ctx);
        }
        return this.navurls.resolve("project", ctx);
    };
    ;
    return ProjectUrlService;
}());
ProjectUrlService = __decorate([
    core_1.Injectable()
], ProjectUrlService);
exports.ProjectUrlService = ProjectUrlService;
;
