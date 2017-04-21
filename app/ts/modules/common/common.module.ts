import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { Svg, LightboxClose } from './index';
import { ProjectUrlService } from './project-url.service';
import { ColorizeBacklogTag, ColorizeBacklogTags } from './tags.component';
import { DateRange } from './components';
import { MainTitle } from "./main-title.component"
import { MessageFormatPipe } from "./message-format.pipe"

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
        MainTitle,
        MessageFormatPipe,
    ],
    declarations: [
        ColorizeBacklogTag,
        ColorizeBacklogTags,
        DateRange,
        Svg,
        LightboxClose,
        MainTitle,
        MessageFormatPipe,
    ],
    providers: [
        ProjectUrlService
    ]
})
export class TgCommonModule {}
