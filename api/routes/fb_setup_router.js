'use strict'

var axios = require('axios');
var qs = require('querystring');
var express = require('express');
var path = require('path');
var fb_setup_router = express.Router();
var constants_helper = require('../utils/constants_helper.js');
var message_helper = require('../utils/message_helper.js');

/**
 *  setup all route
 */
fb_setup_router.route("/")
    .get((req, res) => {
        var responses = [];
        setupGetStarted((response1) => {
            responses.push(response1);
            setupPersistentMenu((response2) => {
                responses.push(response2);
                setupWhitelist((response3) => {
                    responses.push(response3);
                    res.json(responses);
                })
            })
        })
    });

/**
 *  setup get started button
 */
fb_setup_router.route("/getStarted")
    .get((req, res) => {
        setupGetStarted((response) => {
            res.send(response);
        })
    });

/**
 * setup persistent menus
 */
fb_setup_router.route("/persistentMenu")
    .get((req, res) => {
        setupPersistentMenu((response) => {
            res.send(response);
        })
    });

/**
 * setup whitelist websites
 */
fb_setup_router.route("/whiteList")
    .get((req, res) => {
        setupWhitelist((response) => {
            res.send(response);
        })
    });

/**
 * setup db tables
 */
fb_setup_router.route("/db")
    .get((req, res) => {
        message_helper.init((response) => {
            res.send(response);
        })
    });


// private methods
//#############################################################################
function setupGetStarted(callback) {

    var json = {
        "setting_type": "call_to_actions",
        "thread_state": "new_thread",
        "call_to_actions": [
            {
                "payload": "GET_STARTED"
            }
        ]
    };

    axios.post(
        constants_helper.fb_thread_url +"?"+qs.stringify({ access_token: constants_helper.fb_token }),
        json
    ).then((response) => {
        callback(response.data);
    }).catch((err) => {
        callback(err);
    });

}


function setupPersistentMenu(callback) {

    var json = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": true,
                "call_to_actions": [
                    {
                        "title": "Get Started",
                        "type": "postback",
                        "payload": "GET_STARTED"
                    },
                    {
                        "title": "HELP",
                        "type": "postback",
                        "payload": "HELP"
                    },
                ]
            },
            {
                "locale": "zh_CN",
                "composer_input_disabled": false
            }
        ]
    }

    axios.post(
        constants_helper.fb_messenger_profile  +"?"+ qs.stringify({ access_token: constants_helper.fb_token }),
        json
    ).then((response) => {
        callback(response.data);
    }).catch((err) => {
        callback(err);
    });
}


function setupWhitelist(callback) {

    var json = {
        "setting_type": "domain_whitelisting",
        "whitelisted_domains": constants_helper.whitelisted_domains,
        "domain_action_type": "add"
    }

    axios.post(
        constants_helper.fb_thread_url +"?"+ qs.stringify({ access_token: constants_helper.fb_token }),
        json
    ).then((response) => {
        callback(response.data);
    }).catch((err) => {
        callback(err);
    });    
}



module.exports = fb_setup_router;