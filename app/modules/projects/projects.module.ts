import {NgModule} from "@angular/core"
import {RouterModule} from "@angular/router"
import {CommonModule} from "@angular/common"
import {TranslateModule} from "@ngx-translate/core"
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TgCommonModule } from "../../ts/modules/common/common.module";
import { TgComponentsModule } from "../components/components.module";

import { ProjectsListing } from './listing/projects-listing.component';

@NgModule({
    imports: [
        CommonModule,
        TgCommonModule,
        TgComponentsModule,
        TranslateModule.forChild({}),
        RouterModule.forChild([
            {path: "projects", component: ProjectsListing},
        ]),
    ],
    exports: [
        ProjectsListing,
    ],
    declarations: [
        ProjectsListing,
    ],
    providers: [
    ],
})
export class ProjectsModule {}
