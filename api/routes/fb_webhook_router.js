'use strict'

var express = require('express');
var path = require('path');
var webhook_router = express.Router();

// init helpers
var args_helper = require('../utils/args_helper.js');
var message_helper = require('../utils/message_helper.js');
var sender_helper = require('../utils/sender_helper.js');
var reply_helper = require('../utils/reply_helper.js');
var constants = require('../utils/constants_helper');

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
                    message_helper.getResponse(keyword, sender, (msgs) => {
                        console.log("############# " + JSON.stringify(msgs));
                        if (msgs.length == 0) {
                            res.sendStatus(200);
                        } else {
                            var messages = [];
                            msgs.forEach((msg) => {
                                messages.push(msg.message);
                            });
                            sender_helper.sendSeriesMessages(sender, messages, (resp) => {
                                res.sendStatus(200);
                            });
                        }
                    });
                } else {
                    res.sendStatus(200);
                }
            }

        } else if (event.changes) {
            console.log("############ feed post received");
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

module.exports = webhook_router;

