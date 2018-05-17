'use strict'

var express = require('express');
var path = require('path');
var webhook_router = express.Router();

// init helpers
var sender_helper = require('../utils/sender_helper.js');
var reply_helper = require('../utils/reply_helper.js');
var constants = require('../utils/constants_helper');

var ChatbotResponse = require('../models/ChatbotResponse');
var service_facade = require('../services/service_facade');

var async = require('async');

webhook_router.route("/")

    // fb verification
    .get((req, res) => {
        if (req.query['hub.verify_token'] === constants.fb_verify_token) {
            return res.send(req.query['hub.challenge']);
        }
        res.send('Error, wrong token');
    })

    /**
     * fb webhook
     * 1. identify page event
     * 1.1. page received a message (messenger)
     * 1.1.1. retrieve keyword (postback)
     * 1.1.2. get response from mlab
     * 1.1.3. call service (if needed)
     * 1.1.4. format message
     * 1.1.5. send message
     * 1.2. some one post in the page
     * 1.2.1. get post id
     * 1.2.2. reply to comment with link
     * 1.3. event not identified
     * 1.3.1 send status 200
     */
    .post((req, res) => {

        //identify event
        var event = req.body.entry[0];

        if (event.messaging) {
            var messaging_events = req.body.entry[0].messaging;
            for (var i = 0; i < Array.from(messaging_events).length; i++) {
                var event = req.body.entry[0].messaging[i];
                var sender = event.sender.id;
                var keyword = "";

                //get keyword
                if (event.postback) {
                    keyword = event.postback.payload;
                } else if (event.message !== undefined && event.message !== null
                    && event.message.quick_reply !== undefined && event.message.quick_reply !== null) {
                    keyword = event.message.quick_reply.payload;
                }

                // Referral handler
                if (messaging_events[i].referral) {
                    if (keyword === "GET_STARTED") {
                        //handle first time users
                    } else {
                        //handle redirect
                    }
                }


                //send messages 
                if (keyword !== null
                    && keyword !== undefined
                    && keyword !== "") {
                    processRequest(sender, keyword, null, ()=>{
                        res.sendStatus(200);
                    })
                } else {
                    res.sendStatus(200);
                }
            }

        } else if (event.changes) {
            // feed received
            var feed = event.changes[0].value;
            var post_id = feed.post_id;
            var comment_id = feed.comment_id;
            var comment_message = feed.message;

            // //reply
            // reply_helper.reply(post_id, comment_id, comment_message, (resp)=>{
            //     console.log("##### reply helper response: " + JSON.stringify(resp));
            //     res.sendStatus(200);
            // });

            reply_helper.quick_reply(post_id, comment_id, comment_message, (resp) => {
                console.log("##### reply helper response: " + JSON.stringify(resp));
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(200);
        }

    });


/**
 * 
 * @description handles response formatting
 * 
 * @param {String} sender 
 * @param {String} text 
 * @param {Object} callback_params 
 * @param {Function} callback_ouput 
 */
function processRequest(sender, text, callback_params, callback_output) {

    var messages = [];
    ChatbotResponse.find({ postback: text })
        .sort({ 'index': 'ascending' })
        .exec((err, resp) => {
            if (typeof resp !== 'undefined' && resp.length > 0) {
                async.forEachSeries(Object.keys(resp),
                    (itr, callback) => {
                        var reply = resp[itr];                        
                        if (reply.service) {
                            // service
                            service_facade.callService(sender, reply,
                                (formatted_msg, array_messages) => {
                                    //service return an array of messages
                                    if (array_messages) {
                                        array_messages.forEach(array_msg => {
                                            
                                            messages.push(replaceKeywords(sender, array_msg));
                                        });
                                    } else {
                                        messages.push(replaceKeywords(sender, formatted_msg));
                                    }
                                    callback();
                                }, callback_params)
                        } else {
                            // send message directly
                            messages.push(replaceKeywords(sender, reply.message));
                            callback();
                        }
                    }, (err) => {                        
                        sender_helper.sendSeriesMessages(sender, messages, (status) => {
                            callback_output();
                        });
                    });
            } else {
                // AI catch block
                callback_output();
            }
        });
}


/**
 * String replace all prototype
 */
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

/**
 * 
 * @param {Object} message 
 */
function replaceKeywords(sender, message){

    var message_string = JSON.stringify(message);

    message_string = message_string.replaceAll("{#sender}", sender);
    message_string = message_string.replaceAll("{#platform}", "facebook");


    return JSON.parse(message_string);
}

module.exports = webhook_router;

