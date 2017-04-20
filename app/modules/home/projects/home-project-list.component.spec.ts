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
 * File: home-project-list-directive.spec.coffee
 */

declare var describe:any;
declare var angular:any;
let module = angular.mock.module;;
declare var inject:any;
declare var it:any;
declare var expect:any;
declare var beforeEach:any;
import * as Immutable from "immutable"
declare var sinon:any;

describe("homeProjectListDirective", function() {
    let compile, provide;
    let scope = (compile = (provide = null));
    let mocks:any = {};
    let template = "<div tg-home-project-list></div>";
    let projects = Immutable.fromJS({
        recents: [
            {id: 1},
            {id: 2},
            {id: 3}
        ]
    });

    let createDirective = function() {
        let elm = compile(template)(scope);
        return elm;
    };

    let _mockTgCurrentUserService = function() {
        mocks.currentUserService = {
            projects
        };

        return provide.value("tgCurrentUserService", mocks.currentUserService);
    };

    let _mockTranslateFilter = function() {
        let mockTranslateFilter = value => value;
        return provide.value("translateFilter", mockTranslateFilter);
    };

    let _mocks = () =>
        module(function($provide) {
            provide = $provide;
            _mockTgCurrentUserService();
            _mockTranslateFilter();
            return null;
        })
    ;

    beforeEach(function() {
        let recents;
        module("templates");
        module("taigaHome");

        _mocks();

        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            return compile = $compile;
        });

        return recents = Immutable.fromJS([
            {
                id:1
            },
            {
                id: 2
            }
        ]);
    });

    return it("home project list directive scope content", function() {
        let elm = createDirective();
        scope.$apply();
        return expect(elm.isolateScope().vm.projects.size).to.be.equal(3);
    });
});
