###
# Copyright (C) 2014-2017 Taiga Agile LLC <taiga@taiga.io>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
# File: user-timeline-pagination-sequence.service.coffee
###

UserTimelinePaginationSequence = () ->
    obj = {}

    obj.generate = (config) ->
        page = 1
        items = Immutable.List()

        config.minItems = config.minItems || 20

        next = () ->
            items = Immutable.List()
            return getContent()

        getContent = () ->
            config.fetch(page).then (response) ->
                page++

                data = response.get("data")

                if config.filter
                    data = config.filter(data)

                if config.map
                    data = data.map(config.map)

                items = items.concat(data)

                if items.size < config.minItems && response.get("next")
                    return getContent()

                return Immutable.Map({
                    items: items,
                    next: response.get("next")
                })

        return {
            next: () -> next()
        }

    return obj

angular.module("taigaUserTimeline").factory("tgUserTimelinePaginationSequenceService", UserTimelinePaginationSequence)
