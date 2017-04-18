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
 * File: modules/common/custom-field-values.coffee
 */

import {bindOnce, debounce, bindMethods} from "../../../ts/utils"
import {generateHash} from "../../../ts/app"
import {Controller} from "../../../ts/classes"
import * as Pikaday from "pikaday"
import * as _ from "lodash"
import * as angular from "angular"
import * as moment from "moment"

// Custom attributes types (see taiga-back/taiga/projects/custom_attributes/choices.py)
let TEXT_TYPE = "text";
let RICHTEXT_TYPE = "url";
let MULTILINE_TYPE = "multiline";
let DATE_TYPE = "date";
let URL_TYPE = "url";


let TYPE_CHOICES = [
    {
        key: TEXT_TYPE,
        name: "ADMIN.CUSTOM_FIELDS.FIELD_TYPE_TEXT"
    },
    {
        key: MULTILINE_TYPE,
        name: "ADMIN.CUSTOM_FIELDS.FIELD_TYPE_MULTI"
    },
    {
        key: DATE_TYPE,
        name: "ADMIN.CUSTOM_FIELDS.FIELD_TYPE_DATE"
    },
    {
        key: URL_TYPE,
        name: "ADMIN.CUSTOM_FIELDS.FIELD_TYPE_URL"
    },
    {
        key: RICHTEXT_TYPE,
        name: "ADMIN.CUSTOM_FIELDS.FIELD_TYPE_RICHTEXT"
    }
];



class CustomAttributesValuesController extends Controller {
    scope: angular.IScope
    rootscope: angular.IScope
    repo:any
    rs:any
    confirm:any
    q:any
    type:any
    objectId:any
    projectId:any
    customAttributes:any
    customAttributesValues:any
    project:any

    static initClass() {
        this.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgResources", "$tgConfirm", "$q"];
    }

    constructor(scope, rootscope, repo, rs, confirm, q) {
        super()
        this.scope = scope;
        this.rootscope = rootscope;
        this.repo = repo;
        this.rs = rs;
        this.confirm = confirm;
        this.q = q;
        bindMethods(this);
        this.type = null;
        this.objectId = null;
        this.projectId = null;
        this.customAttributes = [];
        this.customAttributesValues = null;
    }

    initialize(type, objectId) {
        this.project = this.scope.project;
        this.type = type;
        this.objectId = objectId;
        return this.projectId = this.scope.projectId;
    }

    loadCustomAttributesValues() {
        if (!this.objectId) { return this.customAttributesValues; }
        return this.rs.customAttributesValues[`get_${this.type}`](this.objectId).then(customAttributesValues => {
            this.customAttributes = this.project[`${this.type}_custom_attributes`];
            this.customAttributesValues = customAttributesValues;
            return customAttributesValues;
        });
    }

    getAttributeValue(attribute) {
        let attributeValue = _.clone(attribute);
        attributeValue.value = this.customAttributesValues.attributes_values[attribute.id];
        return attributeValue;
    }

    updateAttributeValue(attributeValue) {
        let onSuccess = () => {
            return this.rootscope.$broadcast("custom-attributes-values:edit");
        };

        let onError = response => {
            this.confirm.notify("error");
            return this.q.reject();
        };

        // We need to update the full array so angular understand the model is modified
        let attributesValues = _.cloneDeep(this.customAttributesValues.attributes_values);
        attributesValues[attributeValue.id] = attributeValue.value;
        this.customAttributesValues.attributes_values = attributesValues;
        this.customAttributesValues.id = this.objectId;
        return this.repo.save(this.customAttributesValues).then(onSuccess, onError);
    }
}
CustomAttributesValuesController.initClass();


export let CustomAttributesValuesDirective = function($templates, $storage) {
    let template = $templates.get("custom-attributes/custom-attributes-values.html", true);

    let collapsedHash = type => generateHash(["custom-attributes-collapsed", type]);

    let link = function($scope, $el, $attrs, $ctrls) {
        let $ctrl = $ctrls[0];
        let $model = $ctrls[1];
        let hash = collapsedHash($attrs.type);
        $scope.collapsed = $storage.get(hash) || false;

        bindOnce($scope, $attrs.ngModel, function(value) {
            $ctrl.initialize($attrs.type, value.id);
            return $ctrl.loadCustomAttributesValues();
        });

        $scope.toggleCollapse = function() {
            $scope.collapsed = !$scope.collapsed;
            return $storage.set(hash, $scope.collapsed);
        };

        return $scope.$on("$destroy", () => $el.off());
    };

    let templateFn = ($el, $attrs) =>
        template({
            requiredEditionPerm: $attrs.requiredEditionPerm
        })
    ;

    return {
        require: ["tgCustomAttributesValues", "ngModel"],
        controller: CustomAttributesValuesController,
        controllerAs: "ctrl",
        restrict: "AE",
        scope: true,
        link,
        template: templateFn
    };
};


export let CustomAttributeValueDirective = function($template, $selectedText, $compile, $translate, datePickerConfigService, wysiwygService) {
    let template = $template.get("custom-attributes/custom-attribute-value.html", true);
    let templateEdit = $template.get("custom-attributes/custom-attribute-value-edit.html", true);

    let link = function($scope, $el, $attrs, $ctrl) {
        let prettyDate = $translate.instant("COMMON.PICKERDATE.FORMAT");

        let render = function(attributeValue, edit=false) {
            let html, value;
            if ((attributeValue.type === DATE_TYPE) && attributeValue.value) {
                value = moment(attributeValue.value, "YYYY-MM-DD").format(prettyDate);
            } else {
                ({ value } = attributeValue);
            }
            let editable = isEditable();

            let ctx = {
                id: attributeValue.id,
                name: attributeValue.name,
                description: attributeValue.description,
                value,
                isEditable: editable,
                type: attributeValue.type
            };

            let scope = $scope.$new();
            scope.attributeHtml = wysiwygService.getHTML(value);

            if (editable && (edit || !value)) {
                html = templateEdit(ctx);

                html = $compile(html)(scope);
                $el.html(html);

                if (attributeValue.type === DATE_TYPE) {
                    let selectedDate;
                    let datePickerConfig = datePickerConfigService.get();
                    _.merge(datePickerConfig, {
                        field: $el.find("input[name=value]")[0],
                        onSelect: date => {
                            return selectedDate = date;
                        },
                        onOpen: () => {
                            if (typeof selectedDate !== 'undefined' && selectedDate !== null) { return $el.picker.setDate(selectedDate); }
                        }
                    });
                    return $el.picker = new Pikaday(datePickerConfig);
                }
            } else {
                html = template(ctx);
                html = $compile(html)(scope);
                return $el.html(html);
            }
        };

        var isEditable = function() {
            let permissions = $scope.project.my_permissions;
            let { requiredEditionPerm } = $attrs;
            return permissions.indexOf(requiredEditionPerm) > -1;
        };

        $scope.saveCustomRichText = (markdown, callback) => {
            attributeValue.value = markdown;
            return $ctrl.updateAttributeValue(attributeValue).then(function() {
                callback();
                return render(attributeValue, false);
            });
        };

        $scope.cancelCustomRichText= () => {
            render(attributeValue, false);

            return null;
        };

        let submit = debounce(2000, event => {
            event.preventDefault();

            let form = $el.find("form").checksley();
            if (!form.validate()) { return; }

            let input = $el.find("input[name=value], textarea[name='value']");
            attributeValue.value = input.val();
            if (attributeValue.type === DATE_TYPE) {
                if (moment(attributeValue.value, prettyDate).isValid()) {
                    attributeValue.value = moment(attributeValue.value, prettyDate).format("YYYY-MM-DD");
                }
            }

            return $scope.$apply(() =>
                $ctrl.updateAttributeValue(attributeValue).then(() => render(attributeValue, false))
            );
        });

        let setFocusAndSelectOnInputField = () => $el.find("input[name='value'], textarea[name='value']").focus().select();

        // Bootstrap
        var attributeValue = $scope.$eval($attrs.tgCustomAttributeValue);
        if ((attributeValue.value === null) || (attributeValue.value === undefined)) {
            attributeValue.value = "";
        }
        $scope.customAttributeValue = attributeValue;
        render(attributeValue);

        //# Actions (on view mode)

        $el.on("click", ".js-value-view-mode span a", event => event.stopPropagation());

        $el.on("click", ".js-value-view-mode", function() {
            if (!isEditable()) { return; }
            if ($selectedText.get().length) { return; }
            render(attributeValue, true);
            return setFocusAndSelectOnInputField();
        });

        $el.on("click", ".js-edit-description", function(event) {
            event.preventDefault();
            render(attributeValue, true);
            return setFocusAndSelectOnInputField();
        });

        //# Actions (on edit mode)
        $el.on("keyup", "input[name=value], textarea[name='value']", function(event) {
            if ((event.keyCode === 13) && (event.currentTarget.type !== "textarea")) {
                return submit(event);
            } else if (event.keyCode === 27) {
                return render(attributeValue, false);
            }
        });

        $el.on("submit", "form", submit);

        $el.on("click", ".js-save-description", submit);

        return $scope.$on("$destroy", () => $el.off());
    };

    return {
        link,
        require: "^tgCustomAttributesValues",
        restrict: "AE"
    };
};
