/*
 * Copyright (C) 2014-2017 Taiga Agile LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: components.module.coffee
 */

import * as angular from "angular"
import {downgradeComponent, downgradeInjectable} from "@angular/upgrade/static"

import {AssignedItemDirective} from "./assigned-to/assigned-item/assigned-item.directive"
import {AssignedToController} from "./assigned-to/assigned-to.controller"
import {AssignedToDirective} from "./assigned-to/assigned-to.directive"
import {AssignedToSelectorController} from "./assigned-to/assigned-to-selector/assigned-to-selector.controller"
import {AssignedToSelectorDirective} from "./assigned-to/assigned-to-selector/assigned-to-selector.directive"
import {AttachmentController} from "./attachment/attachment.controller"
import {AttachmentDirective} from "./attachment/attachment.directive"
import {AttachmentGalleryDirective} from "./attachment/attachment-gallery.directive"
import {AttachmentLinkDirective} from "./attachment-link/attachment-link.directive"
import {AttachmentsDropDirective} from "./attachments-drop/attachments-drop.directive"
import {AttachmentsFullController} from "./attachments-full/attachments-full.controller"
import {AttachmentsFullDirective} from "./attachments-full/attachments-full.directive"
import {AttachmentsFullService} from "./attachments-full/attachments-full.service"
import {AttachmentsPreviewController} from "./attachments-preview/attachments-preview.controller"
import {AttachmentPreviewLightboxDirective} from "./attachments-preview/attachments-preview.directive"
import {AttachmentsPreviewService} from "./attachments-preview/attachments-preview.service"
import {AttachmentsSimpleController} from "./attachments-simple/attachments-simple.controller"
import {AttachmentsSimpleDirective} from "./attachments-simple/attachments-simple.directive"
import {AttachmentSortableDirective} from "./attachments-sortable/attachments-sortable.directive"
import {AutoSelectDirective} from "./auto-select/auto-select.directive"
import {Avatar} from "./avatar/avatar.component"
import {AvatarService} from "./avatar/avatar.service"
import {BelongToEpics} from "./belong-to-epics/belong-to-epics.component"
import {BindCode} from "./bind-code.directive"
import {BoardZoomDirective} from "./board-zoom/board-zoom.directive"
import {CardController} from "./card/card.controller"
import {cardDirective} from "./card/card.directive"
import {CardSlideshowController} from "./card-slideshow/card-slideshow.controller"
import {cardSlideshowDirective} from "./card-slideshow/card-slideshow.directive"
import {ClickInputFile} from "./click-input-file.directive"
import {ColorSelectorController} from "./color-selector/color-selector.controller"
import {ColorSelectorDirective} from "./color-selector/color-selector.directive"
import {StoryHeaderController} from "./detail/header/detail-header.controller"
import {DetailHeaderDirective} from "./detail/header/detail-header.directive"
import {FileChangeDirective} from "./file-change/file-change.directive"
import {FilterController} from "./filter/filter.controller"
import {FilterDirective} from "./filter/filter.directive"
import {FilterRemoteStorageService} from "./filter/filter-remote.service"
import {FilterSlideDownDirective} from "./filter/filter-slide-down.directive"
import {JoyRideDirective} from "./joy-ride/joy-ride.directive"
import {JoyRideService} from "./joy-ride/joy-ride.service"
import {KanbanBoardZoomDirective} from "./kanban-board-zoom/kanban-board-zoom.directive"
import {LiveAnnouncementDirective} from "./live-announcement/live-announcement.directive"
import {LiveAnnouncementService} from "./live-announcement/live-announcement.service"
import {ProjectLogoBigSrcDirective} from "./project-logo-big-src/project-logo-big-src.directive"
import {ProjectLogoSmallSrcDirective} from "./project-logo-small-src/project-logo-small-src.directive"
import {ProjectMenuController} from "./project-menu/project-menu.controller"
import {ProjectMenuDirective} from "./project-menu/project-menu.directive"
import {TagOptionDirective} from "./tags/tag-dropdown/tag-dropdown.directive"
import {TagLineCommonController} from "./tags/tag-line-common/tag-line-common.controller"
import {TagLineCommonDirective} from "./tags/tag-line-common/tag-line-common.directive"
import {TagLineController} from "./tags/tag-line-detail/tag-line-detail.controller"
import {TagLineDirective} from "./tags/tag-line-detail/tag-line-detail.directive"
import {TagLineService} from "./tags/tag-line.service"
import {TagDirective} from "./tags/tag/tag.directive"
import {TaskboardZoomDirective} from "./taskboard-zoom/taskboard-zoom.directive"
import {TermsOfServiceAndPrivacyPolicyNoticeDirective} from "./terms-of-service-and-privacy-policy-notice/terms-of-service-and-privacy-policy-notice.directive"
import {TribeButtonDirective} from "./tribe-button/tribe-button.directive"
import {TribeLinkedDirective} from "./tribe-button/tribe-linked.directive"
import {VoteButtonController} from "./vote-button/vote-button.controller"
import {VoteButtonDirective} from "./vote-button/vote-button.directive"
import {WatchButtonController} from "./watch-button/watch-button.controller"
import {WatchButtonDirective} from "./watch-button/watch-button.directive"
import {CommentEditWysiwyg} from "./wysiwyg/comment-edit-wysiwyg.directive"
import {CommentWysiwyg} from "./wysiwyg/comment-wysiwyg.directive"
import {CustomFieldEditWysiwyg} from "./wysiwyg/custom-field-edit-wysiwyg.directive"
import {ItemWysiwyg} from "./wysiwyg/item-wysiwyg.directive"
import {WysiwygCodeHightlighterService} from "./wysiwyg/wysiwyg-code-hightlighter.service"
import {WysiwygCodeLightbox} from "./wysiwyg/wysiwyg-code-lightbox/wysiwyg-code-lightbox.directive"
import {Medium} from "./wysiwyg/wysiwyg.directive"
import {WysiwygMentionService} from "./wysiwyg/wysiwyg-mention.service"
import {WysiwygService} from "./wysiwyg/wysiwyg.service"

let module = angular.module("taigaComponents", []);
module.directive("tgAssignedItem", AssignedItemDirective);
module.controller('AssignedToCtrl', AssignedToController);
module.directive("tgAssignedToComponent", AssignedToDirective);
module.controller('AssignedToSelectorCtrl', AssignedToSelectorController);
module.directive("tgAssignedToSelector", AssignedToSelectorDirective);
module.controller('Attachment', AttachmentController);
module.directive("tgAttachment", AttachmentDirective);
module.directive("tgAttachmentGallery", AttachmentGalleryDirective);
module.directive("tgAttachmentLink", AttachmentLinkDirective);
module.directive("tgAttachmentsDrop", AttachmentsDropDirective);
module.controller("AttachmentsFull", AttachmentsFullController);
module.directive("tgAttachmentsFull", AttachmentsFullDirective);
module.service("tgAttachmentsFullService", AttachmentsFullService);
module.controller('AttachmentsPreview', AttachmentsPreviewController);
module.directive("tgAttachmentsPreview", ["lightboxService", "tgAttachmentsPreviewService", AttachmentPreviewLightboxDirective]);
module.service("tgAttachmentsPreviewService", AttachmentsPreviewService);
module.controller("AttachmentsSimple", AttachmentsSimpleController);
module.directive("tgAttachmentsSimple", AttachmentsSimpleDirective);
module.directive("tgAttachmentsSortable", AttachmentSortableDirective);
module.directive("tgAutoSelect", AutoSelectDirective);
module.directive("tgAvatar", downgradeComponent({component: Avatar}));
module.service("tgAvatarService", downgradeInjectable(AvatarService));
module.directive("tgBelongToEpics", downgradeComponent({component: BelongToEpics}));
module.directive("tgBindCode", ["$sce", "$parse", "$compile", "tgWysiwygService", "tgWysiwygCodeHightlighterService", BindCode]);
module.directive("tgBoardZoom", [BoardZoomDirective]);
module.controller('Card', CardController);
module.directive('tgCard', cardDirective);
module.controller('CardSlideshow', CardSlideshowController);
module.directive('tgCardSlideshow', cardSlideshowDirective);
module.directive("tgClickInputFile", [ClickInputFile]);
module.controller("ColorSelectorCtrl", ColorSelectorController);
module.directive("tgColorSelector", ColorSelectorDirective);
module.controller("StoryHeaderCtrl", StoryHeaderController);
module.directive("tgDetailHeader", DetailHeaderDirective);
module.directive("tgFileChange", FileChangeDirective);
module.controller('Filter', FilterController);
module.directive("tgFilter", [FilterDirective]);
module.service("tgFilterRemoteStorageService", FilterRemoteStorageService);
module.directive("tgFilterSlideDown", [FilterSlideDownDirective]);
module.directive("tgJoyRide", JoyRideDirective);
module.service("tgJoyRideService", JoyRideService);
module.directive("tgKanbanBoardZoom", ["$tgStorage", "tgProjectService", KanbanBoardZoomDirective]);
module.directive("tgLiveAnnouncement", LiveAnnouncementDirective);
module.service("tgLiveAnnouncementService", LiveAnnouncementService);
module.directive("tgProjectLogoBigSrc", ProjectLogoBigSrcDirective);
module.directive("tgProjectLogoSmallSrc", ProjectLogoSmallSrcDirective);
module.controller("ProjectMenu", ProjectMenuController);
module.directive("tgProjectMenu", ProjectMenuDirective);
module.directive("tgTagsDropdown", TagOptionDirective);
module.controller("TagLineCommonCtrl", TagLineCommonController);
module.directive("tgTagLineCommon", TagLineCommonDirective);
module.controller("TagLineCtrl", TagLineController);
module.directive("tgTagLine", TagLineDirective);
module.service("tgTagLineService", TagLineService);
module.directive("tgTag", TagDirective);
module.directive("tgTaskboardZoom", ["$tgStorage", TaskboardZoomDirective]);
module.directive("tgTermsOfServiceAndPrivacyPolicyNotice", ["$tgConfig", TermsOfServiceAndPrivacyPolicyNoticeDirective]);
module.directive("tgTribeButton", TribeButtonDirective);
module.directive("tgTribeLinked", TribeLinkedDirective);
module.controller("VoteButton", VoteButtonController);
module.directive("tgVoteButton", VoteButtonDirective);
module.controller("WatchButton", WatchButtonController);
module.directive("tgWatchButton", WatchButtonDirective);
module.directive("tgCommentEditWysiwyg", ["tgAttachmentsFullService", CommentEditWysiwyg]);
module.directive("tgCommentWysiwyg", ["tgAttachmentsFullService", CommentWysiwyg]);
module.directive("tgCustomFieldEditWysiwyg", ["tgAttachmentsFullService", CustomFieldEditWysiwyg]);
module.directive("tgItemWysiwyg", [ "$tgQueueModelTransformation", "$rootScope", "$tgConfirm", "tgAttachmentsFullService", "$translate", ItemWysiwyg]);
module.service("tgWysiwygCodeHightlighterService", WysiwygCodeHightlighterService);
module.directive("tgWysiwygCodeLightbox", ["lightboxService", WysiwygCodeLightbox]);
module.directive("tgWysiwyg", ["$translate", "$tgConfirm", "$tgStorage", "tgWysiwygService", "animationFrame", "tgLoader", "tgWysiwygCodeHightlighterService", "tgWysiwygMentionService", "$tgAnalytics", "$location", Medium ]);
module.service("tgWysiwygMentionService", WysiwygMentionService);
module.service("tgWysiwygService", WysiwygService);
