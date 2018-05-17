'use strict'

var constants_helper = require('./constants_helper.js');
var axios = require('axios');
var qs = require('querystring');
var async = require('async');
var request = require('request');

/**
 * 
 * @param {Number} sender 
 * @param {String} messages 
 */
function sendSeriesMessages(sender, messages, callback_output) {
    async.forEachSeries(Object.keys(messages),
        function (itr, callback) {
            sendMessageCallback(sender, messages[itr], callback);
        }, function (err) {
            callback_output();
        });

}

/**
 * 
 * @param {String} sender 
 * @param {String} messageData 
 * @param {function} callback 
 */
function sendMessageCallback(sender, messageData, callback) {
    
    request({
        url: constants_helper.fb_message_url,
        qs: { access_token: constants_helper.fb_token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
        callback(null);
    })
}

/**
 * 
 * @param {String} sender 
 * 
 */
function typing(sender) {
    request({
        url: constants_helper.fb_message_url,
        qs: { access_token: constants_helper.fb_token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            sender_action: "typing_on"
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

module.exports = {
    sendSeriesMessages,
    typing
};