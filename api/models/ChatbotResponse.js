var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatbotResponseSchema = new Schema({
        postback: String,
        message: {},
        type: String,
        service: String,
        index: Number,
        active: String
});


module.exports = mongoose.model('chatbot_response', ChatbotResponseSchema);