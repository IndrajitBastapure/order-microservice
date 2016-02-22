var express = require('express');
var	bodyParser = require('body-parser');
var mysql = require("mysql");

var order = require('./routes/order');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', order);

//set the server environment
var env = app.get('env') == 'development' ? 'dev' : app.get('env');
var port = process.env.PORT || 8080;

app.use(function(req, res, next){
  res.status(503);
  json = JSON.stringify({
			status : 503,
			description : "Invalid service URL",
			errors: [
			  {
				  msg : "Service Unavailable : Cannot "+req.method+" " + req.url
			  }
			],
			data : []
  });
  res.send(json);
  return;
});

app.use(function(err, req, res, next) {
if(err.status == 400){
   json = JSON.stringify({
    status : 400,
    description : "Bad request",
	errors : [
		{
			msg : "Unparsable Json request"
		}
	],
    data : []
    
   });
   res.send(json);
   return;
  }
});

app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;