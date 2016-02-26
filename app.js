var express = require('express');
var	bodyParser = require('body-parser');
var mysql = require("mysql");

var order = require('./routes/order');
var health = require('./routes/health');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', order);
app.use('/', health);

//set the server environment
var env = app.get('env') == 'development' ? 'dev' : app.get('env');
var port = process.env.PORT || 8080;

app.use(function(req, res, next){
  res.status(503);
  json = {
			status : 503,
			description : "Invalid service URL",
			errors: [
			  {
				  msg : "Service Unavailable : Cannot "+req.method+" " + req.url
			  }
			],
			data : []
  };
  res.json(json);
  return;
});

app.use(function(err, req, res, next) {
if(err.status == 400){
   json = {
    status : 400,
    description : "Bad request",
	errors : [
		{
			msg : "Unparsable Json request"
		}
	],
    data : []
    
   };
   res.json(json);
   return;
  }
});
module.exports = app;