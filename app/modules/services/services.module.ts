import {NgModule} from "@angular/core"

import {AppMetaService} from "./app-meta.service"
import {CurrentUserService} from "./current-user.service"
import {ErrorHandlingService} from "./error-handling.service"
import {ProjectLogoService} from "./project-logo.service"
import {GlobalDataService} from "./global-data.service"
import {ThemeService} from "./theme.service"
import {xhrError} from "./xhrError.service"
import { PaginateResponseService } from './paginate-response.service';

@NgModule({
    providers: [
        AppMetaService,
        CurrentUserService,
        ErrorHandlingService,
        ProjectLogoService,
        GlobalDataService,
        ThemeService,
        xhrError,
        PaginateResponseService,
    ]
})
export class TgServicesModule{}
