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
 * File: modules/base/model.coffee
 */

import * as _ from "lodash"
import {Injectable} from "@angular/core"

export class Model {
    _attrs:any
    _name:any
    _dataTypes:any
    _modifiedAttrs:any
    _isModified:any

    constructor(name, data, dataTypes=null) {
        this._attrs = data;
        this._name = name;
        this._dataTypes = dataTypes;

        this.setAttrs(data);
        this.initialize();
    }

    realClone() {
        let attrs = _.cloneDeep(this._attrs);

        let instance =  new Model(this._name, attrs, this._dataTypes);

        instance._modifiedAttrs = _.cloneDeep(this._modifiedAttrs);
        instance._isModified = _.cloneDeep(this._isModified);

        return instance;
    }

    clone() {
        let instance = new Model(this._name, this._attrs, this._dataTypes);
        instance._modifiedAttrs = this._modifiedAttrs;
        instance._isModified = this._isModified;
        return instance;
    }

    applyCasts() {
        return (() => {
            let result = [];
            for (let attrName in this._dataTypes) {
                let castName = this._dataTypes[attrName];
                // let castMethod = service.casts[castName];
                // if (!castMethod) {
                //     continue;
                // }
                //
                // result.push(this._attrs[attrName] = castMethod(this._attrs[attrName]));
            }
            return result;
        })();
    }

    getIdAttrName() {
        return "id";
    }

    getName() {
        return this._name;
    }

    getAttrs(patch=false) {
        if (this._attrs.version != null) {
            this._modifiedAttrs.version = this._attrs.version;
        }

        if (patch) {
            return _.extend({}, this._modifiedAttrs);
        }
        return _.extend({}, this._attrs, this._modifiedAttrs);
    }

    setAttrs(attrs) {
        this._attrs = attrs;
        this._modifiedAttrs = {};

        this.applyCasts();
        return this._isModified = false;
    }

    setAttr(name, value) {
        this._modifiedAttrs[name] = value;
        return this._isModified = true;
    }

    initialize() {
        let self = this;

        let getter = name =>
            function() {
                if ((typeof(name) === 'string') && (name.substr(0,2) === "__")) {
                    return self[name];
                }

                if (!_.has(self._modifiedAttrs, name)) {
                    return self._attrs[name];
                }

                return self._modifiedAttrs[name];
            }
        ;

        let setter = name =>
            function(value) {
                if ((typeof(name) === 'string') && (name.substr(0,2) === "__")) {
                    self[name] = value;
                    return;
                }

                if (self._attrs[name] !== value) {
                    self._modifiedAttrs[name] = value;
                    self._isModified = true;
                } else {
                    delete self._modifiedAttrs[name];
                }

            }
        ;

        return _.each(this._attrs, function(value, name) {
            let options = {
                get: getter(name),
                set: setter(name),
                enumerable: true,
                configurable: true
            };

            return Object.defineProperty(self, name, options);
        });
    }

    serialize() {
        let data = {
            "data": _.clone(this._attrs),
            "name": this._name
        };

        return JSON.stringify(data);
    }

    isModified() {
        return this._isModified;
    }

    isAttributeModified(attribute) {
        return (this._modifiedAttrs[attribute] != null);
    }

    markSaved() {
        this._isModified = false;
        this._attrs = this.getAttrs();
        return this._modifiedAttrs = {};
    }

    revert() {
        this._modifiedAttrs = {};
        return this._isModified = false;
    }

    static desSerialize(sdata) {
        let ddata = JSON.parse(sdata);
        let model = new Model(ddata.url, ddata.data);
        return model;
    }
}


@Injectable()
export class ModelService {
    cls = Model;

    make_model(name, data, cls=Model, dataTypes={}) {
        return new cls(name, data, dataTypes);
    };

    casts = {
        int(value) {
            return parseInt(value, 10);
        },
        float(value) {
            return parseFloat(value);
        }
    };
}
