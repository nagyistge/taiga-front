import {NgModule} from "@angular/core"
import {CommonModule} from "@angular/common"
import {TranslateModule} from "@ngx-translate/core"

import {Home} from './home.component';
import { TgCommonModule } from "../../ts/modules/common/common.module";
import { HomeProjectList } from "./projects/home-project-list.component"

@NgModule({
    imports: [
        CommonModule,
        TgCommonModule,
        TranslateModule.forChild({}),
    ],
    exports: [
        Home,
    ],
    declarations: [
        Home,
        HomeProjectList,
    ],
    providers: [
    ],
})
export class HomeModule {}
