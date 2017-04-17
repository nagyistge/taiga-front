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
 * File: wiki-history.module.coffee
 */

import * as angular from "angular"
import {module} from "../../ts/modules/common"
import {downgradeInjectable} from "@angular/upgrade/static"

import {AppMetaService} from "./app-meta.service"
import {AttachmentsService} from "./attachments.service"
import {CheckPermissionsService} from "./check-permissions.service"
import {CurrentUserService} from "./current-user.service"
import {ErrorHandlingService} from "./error-handling.service"
import {LightboxFactory} from "./lightbox-factory.service"
import {PaginateResponse} from "./paginate-response.service"
import {ProjectLogoService} from "./project-logo.service"
import {ProjectService} from "./project.service"
import {ThemeService} from "./theme.service"
import {UserActivityService} from "./user-activity.service"
import {UserService} from "./user.service"
import {xhrError} from "./xhrError.service"

module.service("tgAppMetaService", AppMetaService);
module.service("tgAttachmentsService", AttachmentsService);
module.service("tgCheckPermissionsService", CheckPermissionsService);
module.service("tgCurrentUserService", CurrentUserService);
module.service("tgErrorHandlingService", downgradeInjectable(ErrorHandlingService));
module.service("tgLightboxFactory", LightboxFactory);
module.factory("tgPaginateResponseService", PaginateResponse);
module.service("tgProjectLogoService", ProjectLogoService);
module.service("tgProjectService", ProjectService);
module.service("tgThemeService", ThemeService);
module.service("tgUserActivityService", UserActivityService);
module.service("tgUserService", UserService);
module.service("tgXhrErrorService", downgradeInjectable(xhrError));
