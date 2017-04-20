declare var _version:string;
import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from "@angular/upgrade/static"
import { RouterModule, UrlHandlingStrategy, UrlTree } from '@angular/router';
import { HttpModule, Http } from '@angular/http';

// NGRX MODULES
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// TAIGA MODULES
import { DiscoverModule } from "../modules/discover/discover.module"
import { HomeModule } from "../modules/home/home.module"
import { TgBaseModule } from './modules/base/base.module';
import { TgServicesModule } from '../modules/services/services.module';
import { ResourcesModule } from '../modules/resources/resources.module';
import { TgComponentsModule } from '../modules/components/components.module';

import { TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthService } from './modules/auth';

import { ProjectsService } from '../modules/projects/projects.service';
import { ProjectUrlService } from './modules/common/project-url.service';
import { DateRange } from './modules/common/components';
import { TgCommonModule } from './modules/common/common.module';
import { NavigationBarModule } from '../modules/navigation-bar/navigation-bar.module';

import {AppComponent} from "./app.component"
import {GlobalEffects} from "./app.effects"
import {rootReducer} from "./app.store"

class HybridUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree) {
      return url.toString() === '/discover' || url.toString() === '/';
  }
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
    HomeModule,
    RouterModule.forRoot([]),
    ResourcesModule,
    DiscoverModule,
    TgCommonModule,
    TgBaseModule,
    TgServicesModule,
    TgComponentsModule,
    NavigationBarModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
        }
    }),
    StoreModule.provideStore(rootReducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(GlobalEffects),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    AuthService,
    ProjectsService,
    ProjectUrlService,
    { provide: UrlHandlingStrategy, useClass: HybridUrlHandlingStrategy }
  ],
  entryComponents: [
    DateRange,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {}
