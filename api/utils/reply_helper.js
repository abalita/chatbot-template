'use strict'

var axios = require('axios');
var qs = require('querystring');
var constants_helper = require('./constants_helper')
var sender_helper = require('../utils/sender_helper')

function reply(post_id, comment_id, message, cb) {

    console.log("########## trying to reply...");
    axios.post(
        constants_helper.fb_page_url + comment_id + "/comments",
        qs.stringify({ access_token: "EAAClbse4gDoBAISPgJy793DpjceQZB2MpjIJ8Uj26sOzjnpxCjNykTj8nzVlv4Ued4HVJFGw7LdVl8BlZAQxz8oFTCCCFPY2fpZCYOVksqpVEftn2QVZANOgPPZCYhHdAex7Dr441PdvaceGZAF1ZC1RwF1n8TyixzgDKBI1GnH6QZDZD" }),
        {
            message: "Thanks for your interest in this item. I can offer you greate deals, chat with me: http://m.me/546544942395196?ref=POST_ID-" + post_id,
        }
    ).then((response) => {
        cb(response.data);
    }).catch((err) => {
        cb(err);
    });

    // request({
    //     url: constants_helper.fb_page_url + comment_id + "/comments",
    //     qs: { access_token: "EAAClbse4gDoBAISPgJy793DpjceQZB2MpjIJ8Uj26sOzjnpxCjNykTj8nzVlv4Ued4HVJFGw7LdVl8BlZAQxz8oFTCCCFPY2fpZCYOVksqpVEftn2QVZANOgPPZCYhHdAex7Dr441PdvaceGZAF1ZC1RwF1n8TyixzgDKBI1GnH6QZDZD" },
    //     method: 'POST',
    //     json: {
    //         message: "Thanks for your interest in this item. I can offer you greate deals, chat with me: http://m.me/546544942395196?ref=POST_ID-" + post_id,
    //     }
    // }, (error, response, body) => {
    //     if (error) {
    //         console.log('Error sending messages: ', error)
    //     } else if (response.body.error) {
    //         console.log('Error: ', response.body.error)
    //     } else {

    //     }
    //     cb(body)

    // })


}


function quick_reply(post_id, comment_id, message, cb) {

    axios.post(
        constants_helper.fb_page_url + comment_id + "/private_replies",
        qs.stringify({ access_token: "EAAClbse4gDoBAISPgJy793DpjceQZB2MpjIJ8Uj26sOzjnpxCjNykTj8nzVlv4Ued4HVJFGw7LdVl8BlZAQxz8oFTCCCFPY2fpZCYOVksqpVEftn2QVZANOgPPZCYhHdAex7Dr441PdvaceGZAF1ZC1RwF1n8TyixzgDKBI1GnH6QZDZD" }),
        {
            message: "Thanks for your interest in this item. I can offer you greate deals. Please enter this promo code to get you started (2018-10009283)",
        }
    ).then((response) => {
        cb(response.data);
    }).catch((err) => {
        cb(err);
    });

    // request({
    //     url: constants_helper.fb_page_url + comment_id + "/private_replies",
    //     qs: { access_token: "EAAClbse4gDoBAISPgJy793DpjceQZB2MpjIJ8Uj26sOzjnpxCjNykTj8nzVlv4Ued4HVJFGw7LdVl8BlZAQxz8oFTCCCFPY2fpZCYOVksqpVEftn2QVZANOgPPZCYhHdAex7Dr441PdvaceGZAF1ZC1RwF1n8TyixzgDKBI1GnH6QZDZD" },
    //     method: 'POST',
    //     json: {
    //         message: { text: "Hi user!" }
    //     }
    // }, (err, resp, body) => {
    //     cb(body)
    // })

}


module.exports = { reply, quick_reply }