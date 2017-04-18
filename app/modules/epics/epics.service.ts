/*
 * Copyright (C) 2014-2017 Taiga Agile LLC <taiga@taiga.io>
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
 * File: epics.service.coffee
 */

import {defineImmutableProperty} from "../../ts/utils"
import * as angular from "angular"
import * as _ from "lodash"
import * as Immutable from "immutable"
import * as Promise from "bluebird"

export class EpicsService {
    projectService:any
    attachmentsService:any
    resources:any
    xhrError:any
    _page:number
    _loadingEpics:boolean
    _disablePagination:boolean
    _epics:any
    epics:any

    static initClass() {
        this.$inject = [
            'tgProjectService',
            'tgAttachmentsService',
            'tgResources',
            'tgXhrErrorService'
        ];
    }

    constructor(projectService, attachmentsService, resources, xhrError) {
        this.projectService = projectService;
        this.attachmentsService = attachmentsService;
        this.resources = resources;
        this.xhrError = xhrError;
        this.clear();

        defineImmutableProperty(this, 'epics', () => { return this._epics; });
    }

    clear() {
        this._loadingEpics = false;
        this._disablePagination = false;
        this._page = 1;
        return this._epics = Immutable.List();
    }

    fetchEpics(reset=false) {
        this._loadingEpics = true;
        this._disablePagination = true;

        return this.resources.epics.list(this.projectService.project.get('id'), this._page)
            .then(result => {
                if (reset) {
                    this.clear();
                    this._epics = result.list;
                } else {
                    this._epics = this._epics.concat(result.list);
                }

                this._loadingEpics = false;

                return this._disablePagination = !result.headers['x-pagination-next'];
        }).catch(xhr => {
                return this.xhrError.response(xhr);
        });
    }

    nextPage() {
        this._page++;

        return this.fetchEpics();
    }

    listRelatedUserStories(epic) {
        return this.resources.userstories.listInEpic(epic.get('id'));
    }

    createEpic(epicData, attachments) {
        epicData.project = this.projectService.project.get('id');

        return this.resources.epics.post(epicData)
            .then(epic => {
                let promises = _.map(attachments.toJS(), (attachment:any) => {
                    return this.attachmentsService.upload(attachment.file, epic.get('id'), epic.get('project'), 'epic');
                });

                return Promise.all(promises).then(this.fetchEpics.bind(this, true));
        });
    }

    reorderEpic(epic, newIndex) {
        let orderList = {};
        this._epics.forEach(it => orderList[it.get('id')] = it.get('epics_order'));

        let withoutMoved = this.epics.filter(it => it.get('id') !== epic.get('id'));
        let beforeDestination = withoutMoved.slice(0, newIndex);
        let afterDestination = withoutMoved.slice(newIndex);

        let previous = beforeDestination.last();
        let newOrder = !previous ? 0 : previous.get('epics_order') + 1;

        orderList[epic.get('id')] = newOrder;

        let previousWithTheSameOrder = beforeDestination.filter(it => {
            return it.get('epics_order') === previous.get('epics_order');
        });

        let setOrders = _.fromPairs(previousWithTheSameOrder.map(it => {
            return [it.get('id'), it.get('epics_order')];
        }).toJS()
        );

        afterDestination.forEach(it => orderList[it.get('id')] = it.get('epics_order') + 1);

        this._epics = this._epics.map(it => it.set('epics_order', orderList[it.get('id')]));
        this._epics = this._epics.sortBy(it => it.get('epics_order'));

        let data = {
            epics_order: newOrder,
            version: epic.get('version')
        };

        return this.resources.epics.reorder(epic.get('id'), data, setOrders).then(newEpic => {
            return this._epics = this._epics.map(function(it) {
                if (it.get('id') === newEpic.get('id')) {
                    return newEpic;
                }

                return it;
            });
        });
    }

    reorderRelatedUserstory(epic, epicUserstories, userstory, newIndex) {
        let withoutMoved = epicUserstories.filter(it => it.get('id') !== userstory.get('id'));
        let beforeDestination = withoutMoved.slice(0, newIndex);

        let previous = beforeDestination.last();
        let newOrder = !previous ? 0 : previous.get('epic_order') + 1;

        let previousWithTheSameOrder = beforeDestination.filter(it => {
            return it.get('epic_order') === previous.get('epic_order');
        });
        let setOrders = _.fromPairs(previousWithTheSameOrder.map(it => {
            return [it.get('id'), it.get('epic_order')];
        }).toJS()
        );

        let data = {
            order: newOrder
        };
        let epicId = epic.get('id');
        let userstoryId = userstory.get('id');
        return this.resources.epics.reorderRelatedUserstory(epicId, userstoryId, data, setOrders)
            .then(() => {
                return this.listRelatedUserStories(epic);
        });
    }

    replaceEpic(epic) {
        return this._epics = this._epics.map(function(it) {
            if (it.get('id') === epic.get('id')) {
                return epic;
            }

            return it;
        });
    }

    updateEpicStatus(epic, statusId) {
        let data = {
            status: statusId,
            version: epic.get('version')
        };

        return this.resources.epics.patch(epic.get('id'), data)
            .then(this.replaceEpic.bind(this));
    }

    updateEpicAssignedTo(epic, userId) {
        let data = {
            assigned_to: userId,
            version: epic.get('version')
        };

        return this.resources.epics.patch(epic.get('id'), data)
            .then(this.replaceEpic.bind(this));
    }
}
EpicsService.initClass();
