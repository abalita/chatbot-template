'use strict'

var request = require('request');
var ServiceModel = require('../models/ServiceModel');


const REPLACEMENT_TYPE = {
    STRING_REPLACEMENT: 'insert',
    ELEMENT_ASSINGMENT: 'assign',
    MESSAGE_ASSIGNMENT: 'message'
}
/**
 * String replace all prototype
 */
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

function callService(sender, reply, callback, callback_params) {

    ServiceModel.findOne({ code: reply.service }, (err, api) => {
        if (err) {
            callback(reply.message);
        }
        if (api) {
            request({
                method: api.method,
                uri: processURL(sender, api, callback_params)
            }, (err, resp, body) => {
                if (err) {
                    callback(reply.message);
                }
                console.log("values: " + JSON.stringify(resp.body))
                var values = resp.body;
                if (typeof values === 'string') {
                    values = JSON.parse(resp.body);
                }
                var array_messages = undefined;
                var message_string = JSON.stringify(reply.message);
                api.mappings.forEach(element => {
                    var replacement = values[element.field];

                    //string replacement
                    if (element.type === REPLACEMENT_TYPE.STRING_REPLACEMENT) {
                        if (typeof replacement !== 'string') {
                            replacement = JSON.stringify(values[element.field]);
                        }
                        message_string = message_string.replaceAll(element.key, replacement);

                        //element assignment
                    } else if (element.type === REPLACEMENT_TYPE.ELEMENT_ASSINGMENT) {
                        var message_json = JSON.parse(message_string);
                        if (element.key.indexOf('.') > -1) {
                            var keys = element.key.split('.');
                            var current_element = message_json;
                            for (var i = 0; i < keys.length - 1; i++) {
                                current_element = current_element[keys[i]];
                            }
                            current_element[keys[keys.length - 1]] = values[element.field]
                        } else {
                            message_json[element.key] = values[element.field];
                        }
                        message_string = JSON.stringify(message_json);

                        //message assignment
                    } else if (element.type === REPLACEMENT_TYPE.MESSAGE_ASSIGNMENT) {
                        array_messages = values[element.field];
                    }
                });

                callback(JSON.parse(message_string), array_messages);
            })
        } else {
            callback(reply.message);
        }
    });
}

var req_params = [
    "{#lat}",
    "{#lon}"
]

// set request parameters
// temporary workaround
function processURL(sender, api, callback_params) {

    api.url = api.url.replaceAll("{#fb_sender}", sender);
    api.url = api.url.replaceAll("{#fb_token}", process.env.FB_TOKEN);

    // if (session.message.location) {
    //     api.url = api.url.replaceAll("{#lat}", session.message.location.lat);
    //     api.url = api.url.replaceAll("{#lon}", session.message.location.lon);
    // }

    // if (session.message.text.indexOf('_#') > -1) {
    //     var args = session.message.text.split('_#');
    //     var text = args[0];
    //     var params = args[1];

    //     api.url = api.url.replaceAll("{#params}", params);

    // }else if(callback_params){
    //     api.url = api.url.replaceAll("{#brand}", encodeURIComponent(callback_params.brand));
    //     api.url = api.url.replaceAll("{#model}", encodeURIComponent(callback_params.model));
    //     api.url = api.url.replaceAll("{#srp}", callback_params.srp);
    //     api.url = api.url.replaceAll("{#dp}", callback_params.dp);
    //     api.url = api.url.replaceAll("{#terms}", callback_params.terms);
    // }

    console.log("############ url " + api.url)
    return api.url
}

module.exports = { callService }