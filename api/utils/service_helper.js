'use strict'

var axios = require('axios');
var qs = require('querystring');
var constants_helper = require('./constants_helper.js');

/**
 * 
 * @param {String} service_name 
 * @param {*} details 
 * @param {function} callback_output 
 */
function processServiceRequest(sender, service_name, details, callback_output) {

    if (service_name === "GET_PROFILE") {
        getProfile(sender, (resp) => {
            callback_output(resp);
        });
    } else {
        callback_output([]);
    }

}

/**
 * @description Retrieve profile details from facebook
 * @param {string} sender 
 * @param {function} callback 
 */
function getProfile(sender, callback) {
    var params = [];
    var url = "https://graph.facebook.com/v2.6/" + sender + "?"
        + qs.stringify({
            access_token: constants_helper.fb_token,
            fields: "first_name,last_name,profile_pic,locale,timezone,gender"
        })
        
    axios.get(url)
        .then((response) => {
            params = [{ label: "{#fname}", value: response.data.first_name }];
            callback(params);
        })

}


/**
 * 
 * @param {string} url 
 * @param {object} qs 
 * @param {string} method 
 * @param {object} body 
 * @param {function} callback 
 */
function callService(url, qs, method, body, callback) {
    //todo
}


module.exports = {
    processServiceRequest
}