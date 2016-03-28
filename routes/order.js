var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
// db config
var env = 'dev';

var config = require('../database.json')[env];

// initialize database connection
var sequelize = new Sequelize(
	config.database,
	config.user,
	config.password,
	{
		host: process.env.MYSQL_PORT_3306_TCP_ADDR,
		logging: console.log,
		timestamp: false
	}
);

  var OrderDAO = sequelize.import("./orderDao");  
  
  router.route('/order/insert')
  
	// create a order (accessed at POST http://localhost:8080/api/order/insert)
	.post(function(req, res) {

	var userId = req.body.userId;
	var productId = req.body.productId;
	var	unitPrice = req.body.unitPrice;
	var	quantity = req.body.quantity;
	var status = req.body.status;
	var json;
	if(!userId || !productId || !unitPrice || !quantity || !status)
	{
		json = {
			status: 422,
			description: "Missing data",
			errors: [
				{
					msg : "Missing a required param in Json. Please check your JSON request."
				}
			],
			data : []
		};
		res.status(200);
		res.json(json);
		console.log("ERROR 422: Missing a required param in Json. Please check your JSON request.");
		return;
	}
	
	if(!(userId == parseInt(userId, 10)) 
		|| !(productId == parseInt(productId, 10)) 
		|| !(unitPrice == parseFloat(unitPrice, 10))
		|| !(quantity == parseInt(quantity, 10))
		|| !(status == "completed")) {
		json = {
			status: 400,
			description: "Incorrect JSON",
			errors: [
				{
					msg : "Incorrect Json request. Please check your JSON request."
				}
			],
			data : []
		};
		res.status(200);
		res.json(json);
		console.log("ERROR 400: Incorrect value for a field in Json. Please check your JSON request.");
		return;
	}
	
	var order = OrderDAO.build({  userId: userId,
			productId: productId,
			unitPrice: unitPrice,
			quantity: quantity,
			status: status	});

	order.add(function(success){
		json = {
			status: 200,
			description: "Order Created!",
			errors: [],
			data : [
				{
					orderId : success.id
				}
			]
		};
		res.json(json);
	},
	function(err) {
		json = {
				status : 500,
				description : "Internal server error",
				errors: [
				  {
					  msg : error
				  }
				],
				data : []
			};
			res.json(json);
	});
});

router.get('/orders',
// get all the orders (accessed at GET http://localhost:8080/api/orders)
function(req, res) {
	var order = OrderDAO.build();
	var json;
	order.retrieveAll(function(order) {
		if (order.length > 0) {
		
		json = {
			"status": 200,
			"description": "Returning the orders",
			"errors": [],
			"data" : [
				{
					orders : order
				}
			]
		};
		
		res.json(json);
		} else {
			json = {
				"status" : 404,
				"description" : "No orders found",
				"errors": [
				  {
					  "msg" : "No orders found"
				  }
				],
				"data" : []
			};
			res.status(200);
			res.json(json);
		}
	  }, function(error) {
			json = {
				status : 500,
				description : "Internal server error",
				errors: [
				  {
					  msg : error
				  }
				],
				data : []
			};
			res.status(500);
			res.json(json);
	  });
});


router.route('/order/:id')

// get a order by id(accessed at GET http://localhost:8080/api/order/:id)
.get(function(req, res) {
	var order = OrderDAO.build();
	var json;
	order.retrieveById(req.params.id, function(order) {
		if (order) {
			console.log("200 OK: order with id "+req.params.id+" retrieved");
			var orderArray = [ order ];
			json = {
			status : 200,
			description : "Returning the order",
			errors: [],
			data : [
				{
					order : orderArray
				}
			]
		};
		res.json(json);
		} else {
		  console.log("ERROR 404: order with id "+req.params.id+" not found");
		  json = {
			status : 404,
			description : "No data found",
			errors: [
			  {
				  msg : "order with id "+req.params.id+" not found"
			  }
			],
			data : []
		  };
		  res.status(200);
		  res.json(json);
		}
	  }, function(error) {
		json = {
			status : 500,
			description : "Internal server error",
			errors: [
			  {
				  msg : error
			  }
			],
			data : []
		};
		res.status(500);
		res.json(json);
	  });
});

router.route('/order/update/:id')

// update a order (accessed at PUT http://localhost:8080/api/order/update/:id)
.put(function(req, res) {

	var order = OrderDAO.build();
	var json;
	order.status = req.body.status;
	
	if(!order.status)
	{
		json = {
			status: 422,
			description: "Missing data",
			errors: [
				{
					msg : "Missing a required param in Json. Please check your JSON request."
				}
			],
			data : []
		};
		res.status(200);
		res.json(json);
		console.log("ERROR 422: Missing a required param in Json. Please check your JSON request.");
		
		return;
	}
	
	if(order.status === "cancel") {
			order.updateById(req.params.id, function(orders) {
				if (orders > 0) {
					console.log("200 OK: order with id "+req.params.id+" updated");	
					
					json = {
					status: 200,
					description: "Order updated!",
					errors: [],
					data : [
							{
								orderId : req.params.id
							}
						]
					};
					
					res.json(json);
				
				} else {
					  console.log("ERROR 404: order with id "+req.params.id+" not found");
					  
					  json = {
						status : 404,
						description : "No data found",
						errors: [
						  {
							  msg : "order with id "+req.params.id+" not found"
						  }
						],
						data : []
					  };
					  res.status(200);
					  res.json(json);
				}
			  }, function(error) {
					console.log("ERROR 500: Internal server error : "+error);
					json = {
					status : 500,
					description : "Internal server error",
					errors: [
					  {
						  msg : error
					  }
					],
					data : []
					};
					res.status(500);
					res.json(json);
			  });
		return;
	  }
	
		json = {
			status: 400,
			description: "Incorrect JSON",
			errors: [
				{
					msg : "Incorrect Json request. Please check your JSON request."
				}
			],
			data : []
		};
		res.status(200);
		res.json(json);
		console.log("ERROR 400: Incorrect value for a field in Json. Please check your JSON request.");	
	
});


router.route('/orders/delete/:userId')
.delete(function(req, res) {
	console.log('------------- Deleting all orders for a particular user from db ------------');
	var order = OrderDAO.build();
	
	order.deleteByUserId(req.params.userId, function(orders) {
		if (orders > 0) {
			console.log('--- orders with userId '+req.params.userId+' deleted!');
		}
		res.status(200);
		res.json("--- orders with userId "+req.params.userId+" deleted!");
	});

});

router.route('/orders/delete')
.delete(function(req, res) {
	console.log('------------- DELETING ALL RECORDS FROM DB ------------');
	var order = OrderDAO.build();
	
	order.deleteAll(function(orders) {
		if (orders > 0) {
			console.log('--- orders deleted! ---');
		}
		res.status(200);
		res.json("--- orders deleted! ---");
	});

});


// Middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

module.exports = router;