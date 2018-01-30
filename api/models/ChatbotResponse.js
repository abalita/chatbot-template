var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatbotResponseSchema = new Schema({
        postback:   String,
        type:       String,
        service:    String,
        quick_replies: [],
        buttons: [],
        message: {},
        index: Number,
        active: String
});


module.exports = mongoose.model('chatbot_response', ChatbotResponseSchema);