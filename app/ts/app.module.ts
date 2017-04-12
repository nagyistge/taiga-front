import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static"

import { ConfigurationService } from './modules/base/conf';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ],
  providers: [
    ConfigurationService
  ],
})
export class AppModule {
  ngDoBootstrap() {}
}
