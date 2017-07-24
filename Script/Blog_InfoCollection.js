var http = require("http");
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
        name : String,
        email : String,
        comment : String
    });
var Blog_Info = mongoose.model('Blog_Info',schema);

module.exports = Blog_Info;