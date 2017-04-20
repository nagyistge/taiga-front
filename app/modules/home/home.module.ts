import {NgModule} from "@angular/core"
import {RouterModule} from "@angular/router"
import {CommonModule} from "@angular/common"
import {TranslateModule} from "@ngx-translate/core"
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {Home} from './home.component';
import { TgCommonModule } from "../../ts/modules/common/common.module";
import { TgComponentsModule } from "../components/components.module";
import { HomeProjectList } from "./projects/home-project-list.component"
import { CurrentUserService } from "../services/current-user.service";
import { WorkingOn } from "./working-on/working-on.component";
import { Duty } from "./duties/duty.component";

import {homeReducer} from "./home.store"
import {HomeEffects} from "./home.effects"

@NgModule({
    imports: [
        CommonModule,
        TgCommonModule,
        TgComponentsModule,
        TranslateModule.forChild({}),
        RouterModule.forChild([
            {path: "", component: Home},
        ]),
        EffectsModule.run(HomeEffects),
    ],
    exports: [
        Home,
    ],
    declarations: [
        Home,
        HomeProjectList,
        WorkingOn,
        Duty
    ],
    providers: [
        CurrentUserService,
    ],
})
export class HomeModule {}
