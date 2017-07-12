var http = require("http");
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
        id : Number,
        name : String,
        age : Number
    });
var User = mongoose.model('User',schema,'firstcollection');

module.exports = User;