import {NgModule} from "@angular/core"
import {CommonModule} from "@angular/common"
import {TranslateModule} from "@ngx-translate/core"

import {TgCommonModule} from '../../ts/modules/common/common.module';
import {DiscoverProjectsService} from "./services/discover-projects.service"
import {DiscoverHomeOrderBy} from "./components/discover-home-order-by/discover-home-order-by.component"
import {DiscoverSearchBar} from "./components/discover-search-bar/discover-search-bar.component"
import {DiscoverSearchListHeader} from "./components/discover-search-list-header/discover-search-list-header.component"
import {Highlighted} from "./components/highlighted/highlighted.component"
import {MostActive} from "./components/most-active/most-active.component"
import {MostLiked} from "./components/most-liked/most-liked.component"
import {DiscoverHome} from "./discover-home/discover-home.component"
import {DiscoverSearch} from "./discover-search/discover-search.component"

@NgModule({
    imports: [
        CommonModule,
        TgCommonModule,
        TranslateModule.forChild({}),
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
    ],
    providers: [
        DiscoverProjectsService
    ],
})
export class DiscoverModule {}
