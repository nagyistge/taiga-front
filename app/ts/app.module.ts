import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static"

import { ConfigurationService } from './modules/base/conf';
import { StorageService } from './modules/base/storage';
import { Svg } from './modules/common';
import { Avatar } from '../modules/components/avatar/avatar.component';
import { AvatarService } from '../modules/components/avatar/avatar.service';
import { ErrorHandlingService } from '../modules/services/error-handling.service';
import { xhrError } from '../modules/services/xhrError.service';
import { UrlsService } from './modules/base/urls';
import { ColorizeBacklogTag, ColorizeBacklogTags } from './modules/common/tags.component';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
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
