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
    function processServiceRequest(sender, service_name, details, callback_output){

        if(service_name === "GET_PROFILE"){
            getProfile(sender, (resp)=>{
                callback_output(resp);
            });
        }else{
            callback_output([]);
        }

    }

    /**
     * @description Retrieve profile details from facebook
     * @param {string} sender 
     * @param {function} callback 
     */
    function getProfile(sender, callback){
        var url = "https://graph.facebook.com/v2.6/"+sender;
        
        axios.get(url,
            qs.stringify({ 
                access_token:constants_helper.fb_token,
                fields:"first_name,last_name,profile_pic,locale,timezone,gender" 
            }),
            json
            ).then((response)=>{
                var params = [{label:"{#fname}", value: response.data.first_name}];
                callback(params);
            }).catch((err)=>{
                callback(null);
            });
                
    }


    /**
     * 
     * @param {string} url 
     * @param {object} qs 
     * @param {string} method 
     * @param {object} body 
     * @param {function} callback 
     */
    function callService(url, qs, method, body, callback){
        // request({
        //     url: url,
        //     qs: header,
        //     method: method,
        //     json: body
        // }, function (error, response, body) {
        //     if (error) {
        //         console.log('Error sending messages: ', error)
        //     } else if (response.body.error) {
        //         console.log('Error: ', response.body.error)
        //     }
        //     var params = [{label:"{#fname}", value: body.first_name}]
        //     callback(params);        
        // })
    }


    module.exports = {
        processServiceRequest
    }