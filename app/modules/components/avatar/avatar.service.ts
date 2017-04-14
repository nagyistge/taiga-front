/*
 * Copyright (C) 2014-2015 Taiga Agile LLC <taiga@taiga.io>
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
 * File: avatar.service.coffee
 */

import {sizeFormat, cartesianProduct} from "../../../ts/utils"
import {murmurhash3_32_gc} from "../../../ts/libs/murmurhash3_gc"
import * as angular from "angular"
import * as Immutable from "immutable"
import * as _ from "lodash"
declare var _version:string;

import {Injectable} from "@angular/core"
import {ConfigurationService} from "../../../ts/modules/base/conf"

@Injectable()
export class AvatarService {
    private logos:any

    constructor(private config:ConfigurationService) {
        let IMAGES = [
            `/${_version}/images/user-avatars/user-avatar-01.png`,
            `/${_version}/images/user-avatars/user-avatar-02.png`,
            `/${_version}/images/user-avatars/user-avatar-03.png`,
            `/${_version}/images/user-avatars/user-avatar-04.png`,
            `/${_version}/images/user-avatars/user-avatar-05.png`
        ];

        let COLORS = [
            "rgba( 178, 176, 204, 1 )",
            "rgba( 183, 203, 131, 1 )",
            "rgba( 210, 198, 139, 1 )",
            "rgba( 214, 161, 212, 1 )",
            "rgba( 247, 154, 154, 1 )"
        ];

        this.logos = cartesianProduct(IMAGES, COLORS);
    }

    getDefault(key) {
        let idx = __mod__(murmurhash3_32_gc(key, 42), this.logos.length);
        let logo = this.logos[idx];

        return { src: logo[0], color: logo[1] };
    }

    getUnnamed() {
        return {
            url: `/${_version}/images/unnamed.png`
        };
    }

    getAvatar(user) {
        let gravatar, logo, root, photo;
        if (!user) { return this.getUnnamed(); }

        if (user instanceof Immutable.Map) {
            gravatar = user.get('gravatar_id');
            photo = user.get('photo');
        } else {
            gravatar = user.gravatar_id;
            photo = user.photo;
        }

        if (!gravatar) { return this.getUnnamed(); }

        if (photo) {
            return {
                url: photo
            };
        } else if ((location.host.indexOf('localhost') !== -1) || !this.config.get("gravatar", true)) {
            root = location.protocol + '//' + location.host;
            logo = this.getDefault(gravatar);

            return {
                url: root + logo.src,
                bg: logo.color
            };
        } else {
            root = location.protocol + '//' + location.host;
            logo = this.getDefault(gravatar);

            let logoUrl = encodeURIComponent(root + logo.src);

            return {
                url: `https://www.gravatar.com/avatar/${gravatar}?d=${logoUrl}`,
                bg: logo.color
            };
        }
    }
}

function __mod__(a, b) {
  a = +a;
  b = +b;
  return (a % b + b) % b;
}
