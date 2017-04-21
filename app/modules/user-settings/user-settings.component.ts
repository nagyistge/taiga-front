/*
 * Copyright (C) 2014-2017 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2017 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2017 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2017 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2017 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2017 Xavi Julian <xavier.julian@kaleidos.net>
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
 * File: modules/user-settings/main.coffee
 */

import {Component } from "@angular/core";
import {Store} from "@ngrx/store";
import {IState} from "../../ts/app.store"
import {ConfigurationService} from "../../ts/modules/base/conf"
import {TranslateService} from "@ngx-translate/core"

@Component({
    selector: "tg-user-settings",
    template: require("./user-settings.jade")()
})
export class UserSettings {
    sectionName = "USER_SETTINGS.MENU.SECTION_TITLE"
    user:any
    availableLanguages
    availableThemes
    defaultLanguage
    defaultTheme

    constructor(private store: Store<IState>,
                private config: ConfigurationService,
                private translate: TranslateService) {
        this.user = this.store.select((state) => state.getIn(["global", "user"]))
        this.availableLanguages =  this.store.select((state) => state.getIn(["user-settings", "languages"]))

        this.availableThemes = this.config.get("themes", []);
        this.defaultTheme = this.config.get("defaultTheme", []);
        // this.defaultLanguage = this.translate.preferredLanguage();
    }

    openDeleteLightbox(user) {
        this.store.dispatch({
            type: "USER_SETTINGS_OPEN_LB_DELETE",
            payload: user
        })
    }

    onSubmitForm() {
        // let form = $el.find("form").checksley();
        // if (!form.validate()) { return; }
        //
        // let changeEmail = this.user.isAttributeModified("email");
        // this.user.lang = this.lang;
        // this.user.theme = this.theme;
        //
        // let onSuccess = data => {
        //     $auth.setUser(data);
        //
        //     if (changeEmail) {
        //         let text = $translate.instant("USER_PROFILE.CHANGE_EMAIL_SUCCESS");
        //         return $confirm.success(text);
        //     } else {
        //         return $confirm.notify('success');
        //     }
        // };
        //
        // let onError = data => {
        //     form.setErrors(data);
        //     return $confirm.notify('error', data._error_message);
        // };
        //
        // return $repo.save($scope.user).then(onSuccess, onError);
    }
}

//############################################################################
//# User Avatar Directive
//############################################################################

export let UserAvatarDirective = function($auth, $model, $rs, $confirm) {
    let link = function($scope, $el, $attrs) {
        let showSizeInfo = () => $el.find(".size-info").removeClass("hidden");

        let onSuccess = function(response) {
            let user = $model.make_model("users", response.data);
            $auth.setUser(user);
            $scope.user = user;

            $el.find('.loading-overlay').removeClass('active');
            return $confirm.notify('success');
        };

        let onError = function(response) {
            if (response.status === 413) { showSizeInfo(); }
            $el.find('.loading-overlay').removeClass('active');
            return $confirm.notify('error', response.data._error_message);
        };

        // Change photo
        $el.on("click", ".js-change-avatar", () => $el.find("#avatar-field").click());

        $el.on("change", "#avatar-field", function(event) {
            if ($scope.avatarAttachment) {
                $el.find('.loading-overlay').addClass("active");
                return $rs.userSettings.changeAvatar($scope.avatarAttachment).then(onSuccess, onError);
            }
        });

        // Use gravatar photo
        $el.on("click", "a.js-use-gravatar", function(event) {
            $el.find('.loading-overlay').addClass("active");
            return $rs.userSettings.removeAvatar().then(onSuccess, onError);
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {link};
};

//############################################################################
//# User Avatar Model Directive
//############################################################################

export let TaigaAvatarModelDirective = function($parse) {
    let link = function($scope, $el, $attrs) {
        let model = $parse($attrs.tgAvatarModel);
        let modelSetter = model.assign;

        return $el.bind('change', () =>
            $scope.$apply(() => modelSetter($scope, $el[0].files[0]))
        );
    };

    return {link};
};
