import {NgModule} from "@angular/core"
import {RouterModule} from "@angular/router"
import {CommonModule} from "@angular/common"
import {TranslateModule} from "@ngx-translate/core"
import { EffectsModule } from '@ngrx/effects';
import { FormsModule }   from '@angular/forms';

import {TgCommonModule} from '../../ts/modules/common/common.module';
import {TgComponentsModule} from '../components/components.module';
import {DiscoverProjectsService} from "./services/discover-projects.service"
import {DiscoverHomeOrderBy} from "./components/discover-home-order-by/discover-home-order-by.component"
import {DiscoverSearchBar} from "./components/discover-search-bar/discover-search-bar.component"
import {FeaturedProjects} from "./components/featured-projects/featured-projects.component"
import {DiscoverSearchListHeader} from "./components/discover-search-list-header/discover-search-list-header.component"
import {Highlighted} from "./components/highlighted/highlighted.component"
import {MostActive} from "./components/most-active/most-active.component"
import {MostLiked} from "./components/most-liked/most-liked.component"
import {DiscoverEffects} from "./discover.effects"
import {DiscoverHome} from "./discover-home/discover-home.component"
import {DiscoverSearch} from "./discover-search/discover-search.component"

@NgModule({
    imports: [
        CommonModule,
        TgCommonModule,
        TgComponentsModule,
        FormsModule,
        TranslateModule.forChild({}),
        RouterModule.forChild([{
            path: "discover",
            component: DiscoverHome,
            children: [
                {path: "search", component: DiscoverSearch}
            ]
        }]),
        EffectsModule.run(DiscoverEffects),
    ],
    exports: [
        DiscoverHome,
        DiscoverSearch,
    ],
    declarations: [
        DiscoverHomeOrderBy,
        DiscoverSearchBar,
        DiscoverSearchListHeader,
        Highlighted,
        MostActive,
        MostLiked,
        DiscoverHome,
        DiscoverSearch,
        FeaturedProjects,
    ],
    providers: [
        DiscoverProjectsService
    ],
})
export class DiscoverModule {}
