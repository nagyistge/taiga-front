import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { Svg, LightboxClose } from './index';
import { ProjectUrlService } from './project-url.service';
import { ColorizeBacklogTag, ColorizeBacklogTags } from './tags.component';
import { DateRange } from './components';
import { MainTitle } from "./main-title.component"

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild({}),
    ],
    exports: [
        ColorizeBacklogTags,
        DateRange,
        Svg,
        LightboxClose,
        MainTitle
    ],
    declarations: [
        ColorizeBacklogTag,
        ColorizeBacklogTags,
        DateRange,
        Svg,
        LightboxClose,
        MainTitle,
    ],
    providers: [
        ProjectUrlService
    ]
})
export class TgCommonModule {}
