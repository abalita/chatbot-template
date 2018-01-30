'use strict'

/**
 * String replace all prototype
 */
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

/**
 * 
 * @param {Object} bot_reponse 
 * @param {Array} params 
 */
function contructMessage(bot_reponse, params, sender) {
    var message_output = {};
    if (bot_reponse.type === "TEXT") {
        message_output = constructTextMessage(bot_reponse.message, params, sender);
    } else if (bot_reponse.type === "GENERIC_TEMPLATE") {

    } else if (bot_reponse.type === "BUTTON_TEMPLATE") {
        message_output = constructButtonTemplate(bot_reponse.message, bot_reponse.buttons, params);
    } else if (bot_reponse.type === "LIST_TEMPLATE") {

    }

    // quick replies
    if (bot_reponse.quick_replies !== null
        && bot_reponse.quick_replies !== undefined
        && bot_reponse.quick_replies.length > 0) {
        message_output.quick_replies = constructQuickReplies(bot_reponse.quick_replies);
    }


    return message_output;
}

/**
 * 
 * @param {Array} replies 
 */
function constructQuickReplies(replies) {
    var quick_replies = [];

    replies.forEach((reply) => {
        var quick_reply =
            {
                content_type: reply.type,
                title: reply.title,
                payload: reply.payload
            };
        quick_replies.push(quick_reply);
    })

    return quick_replies;
}

/**
 * 
 * @param {String} message 
 * @param {Array} args 
 */
function constructTextMessage(message, args, sender) {
    var string_message = JSON.stringify(message);
    args.forEach(function (arg) {
       
        string_message = string_message.replaceAll(arg.label, arg.value);
    })

    //insert fb id
    string_message = string_message.replaceAll("{#sender}", sender);
    
    // return { text: message };;
    return JSON.parse(string_message);
}

function contructGenericTemplate() {

}

/**
 * 
 * @param {String} message 
 * @param {Array} buttons 
 * @param {Array} args 
 */
function constructButtonTemplate(message, buttons, args) {

    args.forEach(function (arg) {
        message = message.replaceAll(arg.label, arg.value);
        buttons.forEach((button) => {
            button.url = message.replaceAll(arg.label, arg.value);
            button.payload = message.replaceAll(arg.label, arg.value);
        });
    })

    var output = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": message,                
            }
        }
    };

    output.attachment.payload.buttons = buttons;

    return output;
}

function constructListTemplate() {

}


module.exports = {
    contructMessage
}