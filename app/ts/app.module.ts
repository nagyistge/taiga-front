import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static"

import { ConfigurationService } from './modules/base/conf';
import { StorageService } from './modules/base/storage';
import { UrlsService } from './modules/base/urls';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ],
  providers: [
    ConfigurationService,
    StorageService,
    UrlsService,
  ],
})
export class AppModule {
  ngDoBootstrap() {}
}
