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
 * File: xhrError.service.spec.coffee
 */

declare var describe:any;
declare var it:any;
declare var expect:any;
declare var beforeEach:any;
declare var sinon:any;
import {xhrError} from "./xhrError.service"

describe("tgXhrErrorService", function() {
    let service: xhrError
    let errorHandlingMock

    beforeEach(function() {
        errorHandlingMock = {
            notfound: sinon.stub(),
            permissionDenied: sinon.stub()
        }
        service = new xhrError(errorHandlingMock)
    });

    it("404 status redirect to not-found page", function() {
        let xhr = { status: 404 };

        let promise = service.response(xhr);

        expect(promise).to.be.rejectedWith(xhr);
        return expect(errorHandlingMock.notfound).to.be.calledOnce;
    });

    it("403 status redirect to permission-denied page", function() {
        let xhr = { status: 403 };

        let promise = service.response(xhr);

        expect(promise).to.be.rejectedWith(xhr);
        return expect(errorHandlingMock.permissionDenied).to.be.calledOnce;
    });
});
