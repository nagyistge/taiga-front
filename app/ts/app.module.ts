declare var _version:string;
import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static"
import { RouterModule, UrlHandlingStrategy, UrlTree } from '@angular/router';
import { HttpModule, Http } from '@angular/http';

import { TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthService } from './modules/auth';
import { ConfigurationService } from './modules/base/conf';
import { NavigationUrlsService } from './modules/base/navurls';
import { StorageService } from './modules/base/storage';
import { ModelService } from './modules/base/model';
import { UrlsService } from './modules/base/urls';
import { RepositoryService } from './modules/base/repository';
import { HttpService } from './modules/base/http';
import { ResourcesModule } from '../modules/resources/resources.module';
import { Svg, LightboxClose, ProjectUrlService } from './modules/common';
import { DateRange } from './modules/common/components';
import { Avatar } from '../modules/components/avatar/avatar.component';
import { BelongToEpics } from '../modules/components/belong-to-epics/belong-to-epics.component';
import { AvatarService } from '../modules/components/avatar/avatar.service';
import { TermsOfServiceAndPrivacyPolicyNotice } from '../modules/components/terms-of-service-and-privacy-policy-notice/terms-of-service-and-privacy-policy-notice.component'
import { ErrorHandlingService } from '../modules/services/error-handling.service';
import { xhrError } from '../modules/services/xhrError.service';
import { ThemeService } from '../modules/services/theme.service';
import { ProjectLogoService } from '../modules/services/project-logo.service';
import { GlobalDataService } from '../modules/services/global-data.service';
import { CurrentUserService } from '../modules/services/current-user.service';
import { PaginateResponseService } from '../modules/services/paginate-response.service';
import { ProjectsService } from '../modules/projects/projects.service';
import { ColorizeBacklogTag, ColorizeBacklogTags } from './modules/common/tags.component';

class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree) { return false; }
  extract(url: UrlTree) { return url; }
  merge(url: UrlTree, whole: UrlTree) { return url; }
}

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, `/${_version}/locales/taiga/locale-`, '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
    HttpModule,
    RouterModule.forRoot([]),
    ResourcesModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
        }
    }),
  ],
  declarations: [
    ColorizeBacklogTag,
    ColorizeBacklogTags,
    Svg,
    Avatar,
    BelongToEpics,
    LightboxClose,
    TermsOfServiceAndPrivacyPolicyNotice,
    DateRange,
  ],
  providers: [
    ConfigurationService,
    StorageService,
    UrlsService,
    AvatarService,
    ErrorHandlingService,
    xhrError,
    ThemeService,
    ProjectLogoService,
    ModelService,
    NavigationUrlsService,
    UrlsService,
    RepositoryService,
    HttpService,
    AuthService,
    GlobalDataService,
    CurrentUserService,
    ProjectsService,
    PaginateResponseService,
    ProjectUrlService,
    { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy }
  ],
  entryComponents: [
    ColorizeBacklogTags,
    Svg,
    Avatar,
    BelongToEpics,
    LightboxClose,
    TermsOfServiceAndPrivacyPolicyNotice,
    DateRange,
  ]
})
export class AppModule {
  ngDoBootstrap() {}
}
