import {NgModule} from "@angular/core";

import {TgCommonModule} from "../common/common.module"

import {ConfigurationService} from "./conf"
import {HttpService} from "./http"
import {ModelService} from "./model"
import {NavigationUrlsDirective} from "./navurls.directive"
import {NavigationUrlsService} from "./navurls.service"
import {RepositoryService} from "./repository"
import {StorageService} from "./storage"
import {UrlsService} from "./urls"

@NgModule({
    exports: [
        NavigationUrlsDirective,
    ],
    declarations: [
        NavigationUrlsDirective,
    ],
    providers: [
        UrlsService,
        StorageService,
        RepositoryService,
        NavigationUrlsService,
        ModelService,
        HttpService,
        ConfigurationService,
    ]
})
export class TgBaseModule {}
