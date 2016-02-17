var express = require('express');
var	bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var port = 8080;
var mysql = require("mysql");
var Sequelize = require('sequelize');
// db config
var env = "dev";
var config = require('./database.json')[env];
var password = config.password ? config.password : null;

// initialize database connection
var sequelize = new Sequelize(
	config.database,
	config.user,
	config.password,
	{
		logging: console.log,
		timestamp: false
	}
);

  var OrderDAO = sequelize.import("./orderDao");

  var router = express.Router();
  
  router.route('/orders')
  
	// create a order (accessed at POST http://localhost:8080/api/orders)
	.post(function(req, res) {

	var userId = req.body.userId;
	var productId = req.body.productId;
	var	unitPrice = req.body.unitPrice;
	var	quantity = req.body.quantity;
	
	if(!userId || !productId || !unitPrice || !quantity)
	{
		res.status(400).send("Bad Request. Please check your JSON request.");
		console.log("ERROR 400: Bad Request. Please check your JSON request format.");
		return;
	}
	
	var order = OrderDAO.build({  userId: userId,
			productId: productId,
			unitPrice: unitPrice,
			quantity: quantity });

	order.add(function(success){
		res.json({ message: 'User created!' });
	},
	function(err) {		
		res.send(err);
	});
})

// get all the orders (accessed at GET http://localhost:8080/api/orders)
.get(function(req, res) {
	var order = OrderDAO.build();
	
	order.retrieveAll(function(order) {
		if (order) {
		  res.json(order);
		} else {
		  res.status(404).send("No order found");
		}
	  }, function(error) {
		res.send("Order not found");
	  });
});


router.route('/orders/:id')

// update a order (accessed at PUT http://localhost:8080/api/orders/:id)
.put(function(req, res) {

	var order = OrderDAO.build();
	
	order.unitPrice = req.body.unitPrice;
	order.quantity = req.body.quantity;
	
	if(!order.unitPrice || !order.quantity)
	{
		res.status(400).send("Bad Request. Please check your JSON request.");
		console.log("ERROR 400: Bad Request. Please check your JSON request format.");
		return;
	}
	
	order.updateById(req.params.id, function(orders) {
		if (orders > 0) {
			console.log("200 OK: order with id "+req.params.id+" updated");
			res.json({ message: 'order with id '+req.params.id+' updated!' });
		} else {
		  console.log("ERROR 404: order with id "+req.params.id+" not found");
		  res.status(404).send("order with id "+req.params.id+" not found");
		}
	  }, function(error) {
		res.send(error);
	  });
	
})

// get a order by id(accessed at GET http://localhost:8080/api/orders/:id)
.get(function(req, res) {
	var order = OrderDAO.build();	
	order.retrieveById(req.params.id, function(orders) {
		if (orders) {
			console.log("200 OK: order with id "+req.params.id+" retrieved");
			res.json(orders);
		} else {
		  console.log("ERROR 404: order with id "+req.params.id+" not found");
		  res.status(404).send("order with id "+req.params.id+" not found");
		}
	  }, function(error) {
		res.send("order not found");
	  });
})

// delete a order by id (accessed at DELETE http://localhost:8080/api/orders/:id)
.delete(function(req, res) {
	var order = OrderDAO.build();
	order.removeById(req.params.id, function(order) {
		if (order) {
			console.log("200 OK: order with id "+req.params.id+" removed");
			res.json({ message: 'order with id '+req.params.id+' removed!' });
		} else {
		  console.log("ERROR 404: order with id "+req.params.id+" not found");
		  res.status(404).send("order with id "+req.params.id+" not found");
		}
	  }, function(error) {
		res.send("order not found");
	  });
});

// Middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);