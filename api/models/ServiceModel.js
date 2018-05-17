'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceModelSchema = new Schema({
        code:   String,
        url:    String,
        method: String,
        platform: String,
        header: {},
        params: {},
        mappings: []
});


module.exports = mongoose.model('services', ServiceModelSchema);