import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static"
import { RouterModule, UrlHandlingStrategy, UrlTree } from '@angular/router';

import { ConfigurationService } from './modules/base/conf';
import { StorageService } from './modules/base/storage';
import { Svg } from './modules/common';
import { Avatar } from '../modules/components/avatar/avatar.component';
import { AvatarService } from '../modules/components/avatar/avatar.service';
import { ErrorHandlingService } from '../modules/services/error-handling.service';
import { xhrError } from '../modules/services/xhrError.service';
import { ThemeService } from '../modules/services/theme.service';
import { ProjectLogoService } from '../modules/services/project-logo.service';
import { UrlsService } from './modules/base/urls';
import { ColorizeBacklogTag, ColorizeBacklogTags } from './modules/common/tags.component';

class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree) { return false; }
  extract(url: UrlTree) { return url; }
  merge(url: UrlTree, whole: UrlTree) { return url; }
}

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
    RouterModule.forRoot([]),
  ],
  declarations: [
    ColorizeBacklogTag,
    ColorizeBacklogTags,
    Svg,
    Avatar,
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
    { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy }
  ],
  entryComponents: [
    ColorizeBacklogTags,
    Svg,
    Avatar,
  ]
})
export class AppModule {
  ngDoBootstrap() {}
}
