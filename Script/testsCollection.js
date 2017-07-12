var http = require("http");
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
        id : Number,
        name : String,
        age : Number
    });
var Test = mongoose.model('Test',schema);

module.exports = Test;