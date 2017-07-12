var http = require("http");
var mongoose = require('mongoose');

var url = 'mongodb://ethanhunt:qwerty@ds155191.mlab.com:55191/mongodbfirst';
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', function (err) {
 console.log("mongodb labs disconnected");
});
db.once('open', function callback () {
  console.log("mongodb labs connected");
});