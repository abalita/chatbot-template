'use strict'

var request = require('request');
var express = require('express');

var callback_router = express.Router();

var sender_helper = require('../utils/sender_helper')
var users = require('./fb_webhook_router').users;

callback_router.route('/broadcast')
    .post((req, res) => {
        var subscribers = req.body.subscribers
        var message = req.body.message;
        var sender = req.body.sender;

        // subscribers.forEach((sender)=>{

        // });
        sender_helper.sendSeriesMessages(sender, message, () => {
            res.sendStatus(200);
        })

    });

callback_router.route('/register')
    .post((req, res) => {
        var sender = req.body.fb_id;

        var message = [];
        message.push({ text: "Thanks for signing up! Here is your customer id: " + sender + "." });
        message.push({
            "text": "Let's start shopping!🛍️",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Browse Categories",
                    "payload": "BROWSE_CATEGORIES"
                },
                {
                    "content_type": "text",
                    "title": "Top Picks",
                    "payload": "TOP_PICKS"
                },
                {
                    "content_type": "text",
                    "title": "Hot New Products",
                    "payload": "HOT_NEW_PRODUCTS"
                }
            ]
        });

        sender_helper.sendSeriesMessages(sender, message, () => {
            res.sendStatus(200);
        })

    });

callback_router.route('/products')
    .post((req, res) => {
        var sender = req.body.sender;
        var items = req.body.items;
        var message = [];

        message.push({ text: "Great! As of now, you have this following items in your carts." });
        items.forEach(item => {
            message.push({ text: item.name });
        });
        message.push({
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "So what do you want to do next?",
                    "buttons": [{
                        "type": "postback",
                        "payload": "BROWSE_CATEGORIES",
                        "title": "Browse Category"
                    }, {
                        "type": "web_url",
                        "url": "https://tv-shop-bot.herokuapp.com/checkout?sender=" + sender,
                        "title": "Check Out",
                        "webview_height_ratio": "full",
                        "messenger_extensions": true
                    }]
                }
            }
        });

        sender_helper.sendSeriesMessages(sender, message, () => {
            res.sendStatus(200);
        })

    });

callback_router.route('/pay')
    .post((req, res) => {
        console.log("###### " + JSON.stringify(req.body.payment_details));
        var sender = req.body.sender;
        var details = req.body.payment_details;
        var message = [];
        var orNo = Math.random().toString(36).substr(2, 9);
        var items = details.items;
        var subTotal = 0;
        var item_elem = []
        items.forEach((item) => {
            subTotal = subTotal + item.total_price;
            item_elem.push({
                "title": item.name,
                "subtitle": "",
                "quantity": item.qty,
                "price": item.total_price,
                "currency": "Php"
            });
        });

        message.push({
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": details.cc_details.account_name,
                    "order_number": orNo,
                    "currency": "USD",
                    "payment_method": "Visa 2345",
                    "order_url": "",
                    "timestamp": "1428444852",
                    "address": {
                        "street_1": details.user.add_line1,
                        "street_2": details.user.add_line2,
                        "city": details.user.city,
                        "postal_code": details.user.zip_code,
                        "state": "CA",
                        "country": "US"
                    },
                    "summary": {
                        "subtotal": subTotal,
                        "shipping_cost": 10,
                        "total_tax": 5,
                        "total_cost": parseFloat(subTotal) + 15
                    },
                    "adjustments": [
                    ],
                    "elements": item_elem
                }
            }
        });

        sender_helper.sendSeriesMessages(sender, message, () => {
            res.sendStatus(200);
        });
    });

callback_router.route('/checkout')
    .post((req, res) => {
        var sender = req.body.sender;
        var details = req.body.payment_details;
        var payment_method = req.body.payment_method;
        var order_no = req.body.order_no;
        var message = [];
        var quickreply = [
            {
                "content_type": "text",
                "title": "Browse Categories",
                "payload": "BROWSE_CATEGORIES"
            },
            {
                "content_type": "text",
                "title": "Top Picks",
                "payload": "TOP_PICKS"
            },
            {
                "content_type": "text",
                "title": "Hot New Products",
                "payload": "HOT_NEW_PRODUCTS"
            },
            {
                "content_type": "text",
                "title": "Signup",
                "payload": "SIGN_UP"
            }
        ];
        message.push({ text: 'Thank you! Your order has been received.' });
        if (payment_method === 'CREDIT_CARD') {
            message.push({ text: 'A receipt has been send to you via email.' });
        } else if (payment_method === 'CASH_ON_DELIVERY') {
            message.push({ text: 'The COD payment method for your order ' + order_no + ' has been approved.' });
        }
        message.push({
            text: 'What do you want to do next?',
            "quick_replies": quickreply
        });
        users[sender] = {};


        sender_helper.sendSeriesMessages(sender, message, () => {
            res.sendStatus(200);
        });
    })
module.exports = callback_router;