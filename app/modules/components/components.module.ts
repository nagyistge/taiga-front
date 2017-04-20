import {NgModule} from "@angular/core"

import {CommonModule} from "@angular/common"
import {TranslateModule} from "@ngx-translate/core"

import {TgCommonModule} from '../../ts/modules/common/common.module';
import {TgBaseModule} from '../../ts/modules/base/base.module';

import {Avatar} from "./avatar/avatar.component"
import { BelongToEpics } from './belong-to-epics/belong-to-epics.component';
import { AvatarService } from './avatar/avatar.service';
import { TermsOfServiceAndPrivacyPolicyNotice } from './terms-of-service-and-privacy-policy-notice/terms-of-service-and-privacy-policy-notice.component'

@NgModule({
    imports: [
        CommonModule,
        TgCommonModule,
        TgBaseModule,
        TranslateModule.forChild({}),
    ],
    exports: [
        Avatar,
        BelongToEpics,
        TermsOfServiceAndPrivacyPolicyNotice,
    ],
    declarations: [
        Avatar,
        BelongToEpics,
        TermsOfServiceAndPrivacyPolicyNotice,
    ],
    providers: [
        AvatarService,
    ]
})
export class TgComponentsModule {}
