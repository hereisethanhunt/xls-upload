var http = require("http");
var Blog_Info = require('./Blog_InfoCollection');
var User = require('./firstcollectionCollection');
require('./dbConnection');
var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser());


app.use(express.static(__dirname + '/../View'));
app.use(express.static(__dirname + '/../Script'));
app.get('/', function(request, response) {
    response.sendFile('main.html');
});
app.get('/index', function(request, response) {
	response.sendFile('index.html');
});


/*app.set('views', __dirname + '/../View');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.get('/index', function(request, response) {
    response.render('index.html');
});
app.get('/', function(request, response) {
    response.render('main.html');
});*/

app.post('/frontend_blog', function(request, response) {
    
    var BlogInfo = new Blog_Info({
        name : request.body.name,
        email: request.body.email,
        comment : request.body.comment 
    });
    BlogInfo.save(function(err) {
        if (!err) {
            console.log('Info saved!');
            Blog_Info.find({}).sort({_id: -1}).limit(6).exec(function (err, docs) {
                if (!err){ 
                    console.log(JSON.stringify(docs));
                    response.send(docs);
                } else {throw err;}
            });
        } else{ throw err; }
    });
    console.log("out??");
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