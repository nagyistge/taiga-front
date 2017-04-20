declare var $:any;
declare var ljs:any;
declare var _version:string;

import {run} from "./app"
import * as _ from "lodash"
// import * as Promise from "bluebird"
import "l.js"
import "Flot"
import "Flot/jquery.flot.time"
import "jquery.flot.tooltip"
import "prismjs/plugins/custom-class/prism-custom-class"
import "pikaday"
import "markdown-it"
import "./export-to-plugins"

(<any>window).taigaConfig = {
    "api": "http://localhost:8000/api/v1/",
    "eventsUrl": null,
    "tribeHost": null,
    "eventsMaxMissedHeartbeats": 5,
    "eventsHeartbeatIntervalTime": 60000,
    "debug": true,
    "defaultLanguage": "en",
    "themes": ["taiga", "material-design", "high-contrast"],
    "defaultTheme": "taiga",
    "publicRegisterEnabled": true,
    "feedbackEnabled": true,
    "privacyPolicyUrl": null,
    "termsOfServiceUrl": null,
    "maxUploadFileSize": null,
    "importers": [],
    "contribPlugins": []
};

(<any>window).taigaContribPlugins = [];
(<any>window)._decorators = [];
(<any>window).addDecorator = (provider, decorator) => (<any>window)._decorators.push({provider, decorator});
(<any>window).getDecorators = () => (<any>window)._decorators;

function loadStylesheet(path:string) {
    $('head').append(`<link rel="stylesheet" href="${path}" type="text/css" />`);
}

function loadPlugin(pluginPath:string) {
    return new Promise(function(resolve, reject) {
        let success = function(plugin) {
            (<any>window).taigaContribPlugins.push(plugin);
            if (plugin.css) {
                loadStylesheet(plugin.css);
            }

            //dont' wait for css
            if (plugin.js) {
                return ljs.load(plugin.js, resolve);
            } else {
                return resolve();
            }
        };

        let fail = () => console.error("error loading", pluginPath);

        return $.getJSON(pluginPath).then(success, fail);
    })
}

function loadPlugins (plugins:string[]) {
    let promises = _.map(plugins, pluginPath => loadPlugin(pluginPath));
    return Promise.all(promises);
}

let promise = $.getJSON("/conf.json");
promise.done(data => (<any>window).taigaConfig = _.assign({}, (<any>window).taigaConfig, data));
promise.fail(() => console.error("Your conf.json file is not a valid json file, please review it."));
promise.always(function() {
    // ljs.load(`/${_version}/js/templates.js`, function() {
        if ((<any>window).taigaConfig.contribPlugins.length > 0) {
            return loadPlugins((<any>window).taigaConfig.contribPlugins).then(() => {
                run();
            });
        } else {
            run()
        }
    // });
});
