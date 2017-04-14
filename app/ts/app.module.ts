import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static"

import { ConfigurationService } from './modules/base/conf';
import { StorageService } from './modules/base/storage';
import { Svg } from './modules/common';
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
  ],
  providers: [
    ConfigurationService,
    StorageService,
    UrlsService,
  ],
  entryComponents: [
    ColorizeBacklogTags,
    Svg,
  ]
})
export class AppModule {
  ngDoBootstrap() {}
}
