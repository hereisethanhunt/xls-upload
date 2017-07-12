var http = require("http");
var Test = require('./testsCollection');
var User = require('./firstcollectionCollection');
require('./dbConnection');
var express = require('express');
var app = express();
var path    = require("path");

app.use(express.static(__dirname + '/../View'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/../Script'));
//Store all JS and CSS in Scripts folder.



app.get('/', function(request, response) {
	response.sendFile('index.html');
    //response.sendFile(path.join(__dirname+'/index.html'));
});



app.set('views', __dirname + '/../View');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.get('/index', function(request, response) {
	response.render('index.html');
});



app.get('/addUser',function(request,response){
    var testone = new Test({
        id : 1,
        name: 'Chris',
        age : 21 
    });
    testone.save(function(err) {
    if (err) throw err;
        console.log('testone created!');
    });
    response.send('data added ' + testone.name);

    // Generate file download
    /*response.download('C:/Users/vishalbisht/Downloads/dms.txt');
	response.json({
        'myJson':'object'
    });
	response.redirect('/foo/bar');
    response.redirect('http://example.com');

    response.send(new Buffer('whoop'));
    response.send({ some: 'json' });
    response.send('<p>some html</p>');
    response.status(404).send('Sorry, we cannot find that!');
    response.status(500).send({ error: 'something blew up' });*/
});

app.get('/findAll', function(request, response) {

    Test.find({}, function(err, docs) {
        if (!err){ 
            console.log(docs);
            } else {throw err;}
    response.send(docs);        
    });
});

app.get('/findExisting', function(request, response) {

    User.find({}, function(err, docs) {
        if (!err){ 
            console.log(docs);
            } else {throw err;}
    response.send(docs);        
    });
});



app.get('/downloadfiles', function(request, response) {
    response.download('C:/Users/vishalbisht/Downloads/dms.txt');
});
























app.get('/books/:user/category/:categorySlug', function(request, response) {
    console.log(request.params);
    var username = request.params.user;
    var category = request.params.categorySlug;
    response.send(request.params);
});


app.get('/contacts',function(request,response){
	response.send('contacts will be shown');
});

app.route('/article')
.get(function(request, response) {
    response.send('Get the article');
})
.post(function(request, response) {
    response.send('Add an article');
})
.put(function(request, response) {
    response.send('Update the article');
});

app.get('/the*man', function(req, res) {
    res.send('the*man');
});

app.get(/bat/, function(req, res) {
    res.send('/bat/');
});

app.use(function(request, response, next) {
    response.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

app.listen(8081,function(){
	console.log('connected');
});
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');