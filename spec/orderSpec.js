var request = require('supertest');
var app = require("../app");
var should = require('should');

describe('loading express', function () {
  var server;
  var orderId;
  beforeEach(function () {
	// process.env.NODE_ENV = 'test';
	server = app.listen(8080, function () {
		console.log('Server started');
	});
 });

  afterEach(function () {
	console.log('--- Stopping server ---');
    server.close();
  });
  
  it('responds to /api/orders with statusCode 404 No orders found with no orders present in db', function testSlash(done) {
		request(server)
		.get('/api/orders')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			res.text.should.match(/{"status":404,"description":"No orders found","errors":\[{"msg":"No orders found"}\],"data":\[\]}/);
			done();
		});
  });
  
  it('responds to /api/order/insert', function testSlash(done) {
  var order = { userId : 100000,
				productId : 15,
				unitPrice : 10.0,
				quantity : 25,
				status : "completed"
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.send(order)
	.end(function (err, res) {
		var responseText = res.text;
		var responseArray = responseText.split(':');
		var orderIdText = responseArray[5];
		var orderIdArray = orderIdText.split('}');
		orderId = orderIdArray[0];
		res.text.should.match(/{"status":200,"description":"Order Created!","errors":\[\],"data":\[{"orderId":/);
		done();
	});
  });
  
  it('responds to /api/order/insert with JSON validation error', function testSlash(done) {
  var order = "{ userId : 100000 productId : 15 unitPrice : 10.0, quantity : 25, status : \"completed\" }";
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":400,"description":"Bad request","errors":\[{"msg":"Unparsable Json request"}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with missing parameter error', function testSlash(done) {
  var order = { userId : 100000,
				unitPrice : 10.0,
				quantity : 25,
				status : "completed"
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":422,"description":"Missing data","errors":\[{"msg":"Missing a required param in Json. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with missing parameter error', function testSlash(done) {
  var order = { productId : 100,
				unitPrice : 10.0,
				quantity : 25,
				status : "completed"
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":422,"description":"Missing data","errors":\[{"msg":"Missing a required param in Json. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with missing parameter error', function testSlash(done) {
  var order = { userId : 100000,
				productId : 100,
				quantity : 25,
				status : "completed"
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":422,"description":"Missing data","errors":\[{"msg":"Missing a required param in Json. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with missing parameter error', function testSlash(done) {
  var order = { userId : 100000,
				productId : 100,
				unitPrice : 25.0,
				status : "completed"
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":422,"description":"Missing data","errors":\[{"msg":"Missing a required param in Json. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with missing parameter error', function testSlash(done) {
  var order = { userId : 100000,
				productId : 100,
				unitPrice : 25.0,
				quantity : 15
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":422,"description":"Missing data","errors":\[{"msg":"Missing a required param in Json. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with JSON validation error', function testSlash(done) {
  var order = { userId : "100000asdxc", 
				productId : 15, 
				unitPrice : 10.0, 
				quantity : 25, 
				status : "completed" 
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":400,"description":"Incorrect JSON","errors":\[{"msg":"Incorrect Json request. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with JSON validation error', function testSlash(done) {
  var order = { userId : 100000, 
				productId : 15, 
				unitPrice : "10.0adcasded", 
				quantity : 25, 
				status : "completed" 
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":400,"description":"Incorrect JSON","errors":\[{"msg":"Incorrect Json request. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with JSON validation error', function testSlash(done) {
  var order = { userId : 100000, 
				productId : 15, 
				unitPrice : 10.0, 
				quantity : "25assdasewsda", 
				status : "completed" 
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":400,"description":"Incorrect JSON","errors":\[{"msg":"Incorrect Json request. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/insert with JSON validation error', function testSlash(done) {
  var order = { userId : 100000, 
				productId : 15.56, 
				unitPrice : 10.0, 
				quantity : 25, 
				status : "completed" 
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":400,"description":"Incorrect JSON","errors":\[{"msg":"Incorrect Json request. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
   it('responds to /api/order/insert with JSON validation error', function testSlash(done) {
  var order = { userId : 100000, 
				productId : 15, 
				unitPrice : 10.0, 
				quantity : 25, 
				status : 123
			  };
			  
  request(server)
    .post('/api/order/insert')
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":400,"description":"Incorrect JSON","errors":\[{"msg":"Incorrect Json request. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('500 Internal Server Error', function testSlash(done) {
  var order = { userId : 100000,
				productId : 15,
				unitPrice : 10.0,
				quantity : 25,
				status : "completed" 
			  };
			  
  request(server)
    .post('/api/order/something_else')
	.send(order)
    .end(function (err, res) {
			res.text.should.match(/{"status":500,"description":"Internal Server Error","errors":\[{"msg":"Cannot/);
			done();
	  });
  });
  
  it('responds to /api/orders with statusCode 200 OK with all records present in db', function testSlash(done) {
  
		request(server)
		.get('/api/orders')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			res.text.should.match(/{"status":200,"description":"Returning the orders","errors":\[\],"data":\[{"orders":\[{"id":/);
			done();
		});
  });
  
  it('500 Internal Server Error', function testPath(done) {
    request(server)
      .get('/api/orders/something_else')
	  .end(function (err, res) {
			res.text.should.match(/{"status":500,"description":"Internal Server Error","errors":\[{"msg":"Cannot/);
			done();
	  });
  });
  
  it('responds to /api/order/<id> with statusCode 200 OK with record present in db', function testSlash(done) {
		request(server)
		.get('/api/order/'+orderId)
		.set('Accept', 'application/json')
		.end(function (err, res) {
			 res.text.should.match(/"status":200,"description":"Returning the order"/);
			done();
		});
  });
  
  it('responds to /api/order/<id> with statusCode 404 No data found with record not present in db', function testSlash(done) {
  
		request(server)
		.get('/api/order/0')
		.set('Accept', 'application/json')
		.end(function (err, res) {
			 res.text.should.match(/"status":404,"description":"No data found"/);
			done();
		});
  });
  
  it('500 Internal Server Error', function testPath(done) {
    request(server)
      .get('/api/order/27/something_else')
      .end(function (err, res) {
			res.text.should.match(/{"status":500,"description":"Internal Server Error","errors":\[{"msg":"Cannot/);
			done();
	  });
  });

  it('responds to /api/order/update/<order_id>', function testUpdate(done) {  
	var order = { 
					status : "cancel" 
				};
			request(server)
			.put('/api/order/update/'+orderId)
			.send(order)
			.end(function (err, res) {
				res.text.should.match(/{"status":200,"description":"Order updated!","errors":\[\],"data":\[{"orderId":/);
				done();
			});
  });
  
  it('responds to /api/order/update/<order_id> with 404 no data found with record not present in db', function testUpdate(done) {
	var order = { 
					status : "cancel" 
				};
			request(server)
			.put('/api/order/update/0')
			.send(order)
			.end(function (err, res) {
			 res.text.should.match(/"status":404,"description":"No data found"/);
			 done();
			});
  });
  
  it('responds to /api/order/update/<order_id> with missing parameter error', function testSlash(done) {
  var order = { 
				userId : 100000,
				productId : 15,
				unitPrice : 10.0,
				quantity : 25
			  };
			  
  request(server)
    .put('/api/order/update/'+orderId)
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":422,"description":"Missing data","errors":\[{"msg":"Missing a required param in Json. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('responds to /api/order/update/<order_id> with incorrect JSON error', function testSlash(done) {
  var order = { 
				status : 12345
			  };
			  
  request(server)
    .put('/api/order/update/'+orderId)
	.type('json')
	.expect('Content-Type', /json/)
	.send(order)
	.end(function (err, res) {
		res.text.should.match(/{"status":400,"description":"Incorrect JSON","errors":\[{"msg":"Incorrect Json request. Please check your JSON request."}\],"data":\[\]}/);
			done();
	});
  });
  
  it('500 Internal Server Error', function testSlash(done) {
		var order = { status : "cancel" };
			request(server)
			.put('/api/orders/update/13/abc')
			.send(order)
			.end(function (err, res) {
			res.text.should.match(/{"status":500,"description":"Internal Server Error","errors":\[{"msg":"Cannot/);
			done();
	  });
  });
  
  it('DELETE /api/orders/delete/:userId', function (done) {
	request(server)
	.delete('/api/orders/delete/100000')
	.end(function (err) {
		if(err) {
			done(err);
		}
		done();
	});
  });
});