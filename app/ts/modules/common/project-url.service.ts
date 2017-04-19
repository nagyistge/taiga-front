import {Injectable} from "@angular/core"
import {NavigationUrlsService} from "../base/navurls.service"

@Injectable()
export class ProjectUrlService {
    constructor(private navurls: NavigationUrlsService) {}

    get(project) {
        if (project.toJS) {
            project = project.toJS();
        }

        let ctx = {project: project.slug};

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
};
