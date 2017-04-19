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
 * File: utils.coffee
 */
"use strict";
exports.__esModule = true;
var _ = require("lodash");
function addClass(el, className) {
    if (el.classList) {
        return el.classList.add(className);
    }
    else {
        return el.className += " " + className;
    }
}
exports.addClass = addClass;
;
function nl2br(str) {
    var breakTag = '<br />';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + breakTag + "$2");
}
exports.nl2br = nl2br;
;
function bindMethods(object) {
    var dependencies = _.keys(object);
    var methods = [];
    _.forIn(object, function (value, key) {
        if (!_.includes(dependencies, key) && _.isFunction(value)) {
            return methods.push(key);
        }
    });
    return _.bindAll(object, methods);
}
exports.bindMethods = bindMethods;
;
function bindOnce(scope, attr, continuation) {
    var val = scope.$eval(attr);
    if (val !== undefined) {
        return continuation(val);
    }
    var delBind = null;
    return delBind = scope.$watch(attr, function (val) {
        if (val === undefined) {
            return;
        }
        continuation(val);
        if (delBind) {
            return delBind();
        }
    });
}
exports.bindOnce = bindOnce;
;
function trim(data, char) {
    if (char === void 0) { char = undefined; }
    return _.trim(data, char);
}
exports.trim = trim;
function slugify(data) {
    return data.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}
exports.slugify = slugify;
function unslugify(data) {
    if (data) {
        return _.capitalize(data.replace(/-/g, ' '));
    }
    return data;
}
exports.unslugify = unslugify;
;
function toggleText(element, texts) {
    var nextTextPosition = element.data('nextTextPosition');
    if ((nextTextPosition == null) || (nextTextPosition >= texts.length)) {
        nextTextPosition = 0;
    }
    var text = texts[nextTextPosition];
    element.data('nextTextPosition', nextTextPosition + 1);
    return element.text(text);
}
exports.toggleText = toggleText;
;
function groupBy(coll, pred) {
    var result = {};
    for (var _i = 0, coll_1 = coll; _i < coll_1.length; _i++) {
        var item = coll_1[_i];
        result[pred(item)] = item;
    }
    return result;
}
exports.groupBy = groupBy;
;
function timeout(wait, continuation) {
    window.setTimeout(continuation, wait);
}
exports.timeout = timeout;
function cancelTimeout(timeoutVar) {
    window.clearTimeout(timeoutVar);
}
exports.cancelTimeout = cancelTimeout;
function scopeDefer(scope, func) {
    return _.defer(function () {
        return scope.$apply(func);
    });
}
exports.scopeDefer = scopeDefer;
function toString(value) {
    if (_.isNumber(value)) {
        return value + "";
    }
    else if (_.isString(value)) {
        return value;
    }
    else if (_.isPlainObject(value)) {
        return JSON.stringify(value);
    }
    else if (_.isUndefined(value)) {
        return "";
    }
    return value.toString();
}
exports.toString = toString;
function joinStr(str, coll) {
    return coll.join(str);
}
exports.joinStr = joinStr;
function debounce(wait, func) {
    return _.debounce(func, wait, { leading: true, trailing: false });
}
exports.debounce = debounce;
function debounceLeading(wait, func) {
    return _.debounce(func, wait, { leading: false, trailing: true });
}
exports.debounceLeading = debounceLeading;
function startswith(str1, str2) {
    return _.startsWith(str1, str2);
}
exports.startswith = startswith;
function truncate(str, maxLength, suffix) {
    if (suffix === void 0) { suffix = "..."; }
    if ((typeof str !== "string") && !(str instanceof String)) {
        return str;
    }
    var out = str.slice(0);
    if (out.length > maxLength) {
        out = out.substring(0, maxLength + 1);
        out = out.substring(0, Math.min(out.length, out.lastIndexOf(" ")));
        out = out + suffix;
    }
    return out;
}
exports.truncate = truncate;
;
function sizeFormat(input, precision) {
    if (precision === void 0) { precision = 1; }
    if (isNaN(parseFloat(input)) || !isFinite(input)) {
        return "-";
    }
    if (input === 0) {
        return "0 bytes";
    }
    var units = ["bytes", "KB", "MB", "GB", "TB", "PB"];
    var number = Math.floor(Math.log(input) / Math.log(1024));
    if (number > 5) {
        number = 5;
    }
    var size = (input / Math.pow(1024, number)).toFixed(precision);
    return size + " " + units[number];
}
exports.sizeFormat = sizeFormat;
;
function stripTags(str, exception) {
    if (exception) {
        var pattern = new RegExp("<(?!" + exception + "s*/?)[^>]+>", 'gi');
        return String(str).replace(pattern, '');
    }
    else {
        return String(str).replace(/<\/?[^>]+>/g, '');
    }
}
exports.stripTags = stripTags;
;
function replaceTags(str, tags, replace) {
    // open tag
    var pattern = new RegExp("<(" + tags + ")>", 'gi');
    str = str.replace(pattern, "<" + replace + ">");
    // close tag
    pattern = new RegExp("</(" + tags + ")>", 'gi');
    str = str.replace(pattern, "</" + replace + ">");
    return str;
}
exports.replaceTags = replaceTags;
;
function defineImmutableProperty(obj, name, fn) {
    return Object.defineProperty(obj, name, {
        get: function () {
            if (!_.isFunction(fn)) {
                throw "defineImmutableProperty third param must be a function";
            }
            var fn_result = fn();
            if (fn_result && _.isObject(fn_result)) {
                if (fn_result.size === undefined) {
                    throw "defineImmutableProperty must return immutable data";
                }
            }
            return fn_result;
        }
    });
}
exports.defineImmutableProperty = defineImmutableProperty;
;
_.mixin({
    removeKeys: function (obj, keys) {
        return _.chain([keys]).flatten().reduce(function (obj, key) {
            delete obj[key];
            return obj;
        }, obj).value();
    }
});
function isImage(name) {
    return name.match(/\.(jpe?g|png|gif|gifv|webm|svg|psd)/i) !== null;
}
exports.isImage = isImage;
function isEmail(name) {
    return (name != null) && (name.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null);
}
exports.isEmail = isEmail;
function isPdf(name) {
    return name.match(/\.(pdf)/i) !== null;
}
exports.isPdf = isPdf;
function patch(oldImmutable, newImmutable) {
    var pathObj = {};
    newImmutable.forEach(function (newValue, key) {
        if (newValue !== oldImmutable.get(key)) {
            if (newValue.toJS) {
                return pathObj[key] = newValue.toJS();
            }
            else {
                return pathObj[key] = newValue;
            }
        }
    });
    return pathObj;
}
exports.patch = patch;
;
exports.DEFAULT_COLOR_LIST = [
    '#fce94f', '#edd400', '#c4a000', '#8ae234', '#73d216', '#4e9a06', '#d3d7cf',
    '#fcaf3e', '#f57900', '#ce5c00', '#729fcf', '#3465a4', '#204a87', '#888a85',
    '#ad7fa8', '#75507b', '#5c3566', '#ef2929', '#cc0000', '#a40000', '#222222'
];
function getRandomDefaultColor() {
    return _.sample(exports.DEFAULT_COLOR_LIST);
}
exports.getRandomDefaultColor = getRandomDefaultColor;
function getDefaulColorList() {
    return _.clone(exports.DEFAULT_COLOR_LIST);
}
exports.getDefaulColorList = getDefaulColorList;
function getMatches(string, regex, index) {
    if (index === void 0) { index = 1; }
    var matches = [];
    var match = null;
    while ((match = regex.exec(string))) {
        if (index === -1) {
            matches.push(match);
        }
        else {
            matches.push(match[index]);
        }
    }
    return matches;
}
exports.getMatches = getMatches;
;
function cartesianProduct() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return _.reduceRight(args, function (a, b) { return _.flatten(_.map(a, function (x) { return _.map(b, function (y) { return [y].concat(x); }); }), true); }, [[]]);
}
exports.cartesianProduct = cartesianProduct;
