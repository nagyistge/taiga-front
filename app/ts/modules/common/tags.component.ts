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
 * File: modules/common/tags.components.ts
 */

import {Component, Input} from "@angular/core"

@Component({
  selector: 'tg-colorize-backlog-tag',
  styles: ['h1 { font-weight: normal; }'],
  template: `
      <span
          class="tag"
          [style.border-left]="getBorder()"
          title="{{name}}">
          {{name}}
      </span>
  `
})
export class ColorizeBacklogTag {
    @Input("name") name: any = [];
    @Input("color") color: any = [];

    getBorder() {
        if(this.color === null) {
            return ""
        }
        return `5px solid ${this.color}`
    }
};

@Component({
  selector: 'tg-colorize-backlog-tags',
  template: `
     <tg-colorize-backlog-tag
        *ngFor="let tag of tags"
        [name]="tag[0]"
        [color]="tag[1]">
     </tg-colorize-backlog-tag>
  `
})
export class ColorizeBacklogTags {
    @Input("tags") tags: any = [];
};
