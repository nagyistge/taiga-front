import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static"

import { ConfigurationService } from './modules/base/conf';
import { StorageService } from './modules/base/storage';
import { UrlsService } from './modules/base/urls';
import { ColorizeBacklogTag, ColorizeBacklogTags } from './modules/common/tags';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ],
  declarations: [
    ColorizeBacklogTag,
    ColorizeBacklogTags,
  ],
  providers: [
    ConfigurationService,
    StorageService,
    UrlsService,
  ],
  entryComponents: [
    ColorizeBacklogTags,
  ]
})
export class AppModule {
  ngDoBootstrap() {}
}
