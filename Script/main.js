var http = require("http");
var db= require('./dbConnection'); // DB connection from db.connection
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var express = require('express');
var session = require('express-session');
var fs = require('fs');
var path = require("path");
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
app.use(cors());
app.use(bodyParser.json());


app.use(express.static(__dirname + './../View/'));

app.use(session({
    secret: 'vishal-bisht-app-secretKey-04121994',
    resave: true,
    saveUninitialized: true
}));


app.get('/', function(request, response) {
    response.sendFile('index.html');
});

// Destination and FileName for file Upload

var storage = multer.diskStorage({ 
	destination: function (req, file, callback) {
		callback(null, './../uploads/')
	},
	filename: function (req, file, callback) {
		var datetimestamp = Date.now();
		callback(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
	}
});

// File Filter for type of File

var upload = multer({ //Multer Settings
	storage: storage,
	fileFilter : function(req, file, callback) { //file filter
		if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
			return callback(new Error('Wrong extension type'));
		}
		callback(null, true);
	}
}).single('file');



app.post('/upload', function(req, res) {

	var exceltojson;
	upload(req,res,function(err){
        /** File filter */

		if(err){
			res.json({error_code:1,err_desc:"Wrong extension type"});
			return;
		}

		/** Multer gives us file info in req.file object */

		if(!req.file){
			res.json({error_code:1,err_desc:"No file passed"});
			return;
		}
        
        /** Check the extension of the incoming file and use the appropriate module */

		if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
			exceltojson = xlsxtojson;
		} else {
			exceltojson = xlstojson;
		}
		try {
			exceltojson({
				input: req.file.path,
				output: 'output.json', 
				lowerCaseHeaders:true
			}, function(err,result){
				if(err) {
					return res.json({error_code:1,err_desc:err, data: null});
				} 
            
               /** Insert Data from sheet to mongoDB */

                db.collection('uploaded_table').insert(result, function(err, records) {
                    if (err) throw err;
                    console.log("Record added ");
                 });

                 /** Fetch Data from Database to display in the frontend */

                 setTimeout(FetchData, 3000);
                 function FetchData(){
                    db.collection("uploaded_table").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    res.send(result);  
                    });
                 }
			});
		} catch (e){
			res.json({error_code:1,err_desc:"Corupted excel file"});
		}
	})
}); 

/** invokes when Editing of records is done from the frontEnd to edit data in the database also */

app.get('/edit_table', function(request, response) {
        var id = request.query["_id"];  // storing the _id to be edited in a variable
        delete request.query["_id"]; // deleting the key-value of _id 
    
        var ObjectID = require('mongodb').ObjectID;
 
        /** giving the edited values of key-value pair to the function */

        db.collection('uploaded_table').update({"_id": ObjectID(id)}, {$set:request.query}, function(err, result){
        if (err) {
            console.log('Error updating object: ' + err);
        } else {
        console.log('' + result + ' document(s) updated');
        }
        });
        
});

/** Display data of tables in the frontEnd So that even after refresh we can see data-of-sheet in frontend */

app.get('/display', function(request, response) {
    db.collection('uploaded_table').find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        response.send(result);  
    }); 
});

/** Delete of row initiated. It uses the _id of the row and deletes data from the database */

app.get('/deleteRow', function(request, response) {
    var _id="";
    for(key in request.query){_id=key;}
            db.collection('uploaded_table').deleteOne({_id: new require('mongodb').ObjectID(_id)}, function(err, result){
                if (err) {
                    console.log(err);
                } else {
                    console.log("deleted");
                }                               
            });
});

/** Server running  */

app.listen(8081,function(){
	console.log('connected');
});

console.log('Server running at http://localhost:8081/');