'use strict'

var ChatbotResponseModel = require('../models/ChatbotResponse.js');
var ServiceModel = require('../models/ServiceModel')
var constants_helper = require('../utils/constants_helper.js');
var service_helper = require('../utils/service_helper.js');
var message_formatter = require('./message_formatter.js')

var async = require('async');

/**
 * @param {function} callback 
 * @description initialize the ChatbotResponseModel
 */
function init(maincallback) {
    var responseModel = new ChatbotResponseModel({
        "postback": "GET_STARTED",
        "message": { text: "Cheers {#fname}!🍻 Welcome to Chatbot Template. " },
        "service": "GET_PROFILE",
        "index": 0
    });

    var serviceModel = new ServiceModel({
        code: "GET_PROFILE",
        url: "https://graph.facebook.com/v2.6/{#fb_sender}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token={#fb_token}",
        method: "GET",
        platform: "facebook",
        mappings: [
            {
                "key": "{#fname}",
                "field": "first_name"
            }
        ]
    })

    async.parallel([
        //insert chatbotresponse
        (callback) => {
            responseModel.save(err => {
                callback();
            })
        },
        // insert servicemodel
        (callback) => {
            serviceModel.save(err => {
                callback();
            })
        }
    ], (err) => {
        if (!err) {
            maincallback({
                success: true,
                errorCode: "0000",
                message: "Saved.",
                responseModel: responseModel
            });
        } else {
            maincallback({
                success: false,
                errorCode: "1100",
                message: "Error saving.",
                error: err
            });
        }
    });
}

/**
 * 
 * @param {String} postback 
 * @param {Number} sender 
 * @param {function} callback 
 * @description This method will format the message retrieved from the DB
 * 
 */
function getResponse(postback, sender, callback) {
    var messages = [];
    // find responses
    ChatbotResponseModel.find({ "postback": postback }, (err, responses) => {
        var count = 0;
        responses.forEach(function (resp, index, array) {
            var args = {};

            //call service
            service_helper.processServiceRequest(sender, resp.service, null, (output) => {
                //construct message
                var msg = { index: resp.index, message: message_formatter.contructMessage(resp, output, sender) };
                //add constructed message
                messages.push(msg);

                count++;
                if (count === array.length) {
                    messages.sort(function (a, b) {
                        return a.index - b.index;
                    });
                    callback(messages);
                }
            });
        });

    });
};


module.exports = {
    init: init,
    getResponse: getResponse
}