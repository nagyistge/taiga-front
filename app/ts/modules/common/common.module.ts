import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { Svg, LightboxClose } from './index';
import { ProjectUrlService } from './project-url.service';
import { ColorizeBacklogTag, ColorizeBacklogTags } from './tags.component';
import { DateRange } from './components';

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
    ],
    declarations: [
        ColorizeBacklogTag,
        ColorizeBacklogTags,
        DateRange,
        Svg,
        LightboxClose,
    ],
    providers: [
        ProjectUrlService
    ]
})
export class TgCommonModule {}
