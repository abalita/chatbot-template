'use strict'

var constants_helper = require('./constants_helper.js');
var axios = require('axios');
var qs = require('querystring');
var async = require('async');

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
            console.log('Error sending messages: ', err);
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
    
    axios.post(
        constants_helper.fb_message_url,
        qs.stringify({ access_token: constants_helper.fb_token }),
        {
            recipient: { id: sender },
            message: messageData,
        }
    ).then((response)=>{
        callback(response); 
    }).catch((err)=>{
        callback(err); 
    });
}

module.exports = {    
    sendSeriesMessages        
};