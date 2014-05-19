var request = require("supertest");
var should = require('should');
var assert = require("assert");
var app = require("../schematico.js").app;
var UserController = require("../schematico.js").UserController;
var RouteController = require("../schematico.js").RouteController;

// Additional Routes
app.delete("/killall",			UserController.Destroy,
								RouteController.Destroy,
								function(req, res) {
									res.send(200, "Destroyed all Users and Routes.");
								});

app.delete("/userByToken",		UserController.DestroyByToken);


// Tests
describe("Static Pages", function() {
	it("GET / should return HTML and 200", function(done) {
		request(app)
		.get("/")
		.expect('Content-Type', 'text/html; charset=utf-8')
		.expect(200, done);
	});
});

describe("API", function() {
	var _email = "example@example.com";
	var _username = "example";
	var _password = "password";
	var _route = "example";
	var _newUserToken;

	it("Create new user should return 201", function(done) {
		var newUser = {
			email : _email,
			username : _username,
			password : _password
		}

		request(app)
		.post("/signup")
		.set("Content-Type", "application/json")
		.send(newUser)
		.end(function(error, res) {
			res.should.have.status(201);
			res.body.should.have.property("token");
			_newUserToken = res.body.token;
			done();
		});
	});

	it("Create the same user should return 400", function(done) {
		var newUser = {
			email : _email,
			username : _username,
			password : _password
		}

		request(app)
		.post("/signup")
		.set("Content-Type", "application/json")
		.send(newUser)
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Creating a new route without a schema and without token should return 400", function(done) {
		request(app)
		.post("/"+_username+"/"+_route)
		.set("Content-Type", "application/json")
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Creating a new route without a schema and with token should return 400", function(done) {
		request(app)
		.post("/"+_username+"/"+_route+"?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Creating a new route with a schema and without token should return 400", function(done) {
		var newSchema = {
			name : "Name",
			email : "Email"
		}

		request(app)
		.post("/"+_username+"/"+_route)
		.set("Content-Type", "application/json")
		.send(newSchema)
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Creating a new route with a schema and with token should return 201", function(done) {
		var newSchema = {
			name : "Name",
			email : "Email"
		}

		request(app)
		.post("/"+_username+"/"+_route+"?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.send(newSchema)
		.end(function(error, res) {
			res.should.have.status(201);
			done();
		});
	});

	it("Recover token with good credentials should return 200", function(done) {
		var goodCredentials = {
			email : _email,
			password : _password
		}

		request(app)
		.post("/recover")
		.set("Content-Type", "application/json")
		.send(goodCredentials)
		.end(function(error, res) {
			res.should.have.status(200);
			done();
		});
	});

	it("Recover token with bad credentials should return 400", function(done) {
		var badCredentials = {
			email : "example1@email.com",
			password : "example1"
		}

		request(app)
		.post("/recover")
		.set("Content-Type", "application/json")
		.send(badCredentials)
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Get a list of all routes for this user, the list count should be 1", function(done) {
		request(app)
		.get("/"+_username+"/routes")
		.set("Content-Type", "application/json")
		.end(function(error, res) {
			res.body.should.be.instanceof(Array).and.have.lengthOf(1);
			done();
		});
	});

	it("Get random data for the route should return a non-empty object", function(done) {
		request(app)
		.get("/"+_username+"/"+_route+"?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.end(function(error, res) {
			res.body.should.not.be.empty;
			done();
		});
	});

	it("Get random data for a nonexisting route should return 400", function(done) {
		request(app)
		.get("/"+_username+"/this_route_doesnt_exist?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Update route without token should return 400", function(done) {
		var newSchema = {
			name : "Name",
			email : "Email"
		}

		request(app)
		.put("/"+_username+"/"+_route)
		.set("Content-Type", "application/json")
		.send(newSchema)
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Update route with token should return 200", function(done) {
		var newSchema = {
			name : "Name",
			email : "Email"
		}

		request(app)
		.put("/"+_username+"/"+_route+"?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.send(newSchema)
		.end(function(error, res) {
			res.should.have.status(200);
			done();
		});
	});

	it("Delete route without token should return 400", function(done) {
		request(app)
		.delete("/"+_username+"/"+_route)
		.set("Content-Type", "application/json")
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Delete route without token should return 200", function(done) {
		request(app)
		.delete("/"+_username+"/"+_route+"?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.end(function(error, res) {
			res.should.have.status(200);
			done();
		});
	});

	it("Create another user with the same details should return 400", function(done) {
		var newUser = {
			email : _email,
			username : _username,
			password : _password
		}

		request(app)
		.post("/signup")
		.set("Content-Type", "application/json")
		.send(newUser)
		.end(function(error, res) {
			res.should.have.status(400);
			res.body.should.not.have.property("token");
			done();
		});
	});

	it("Delete user with bad credentials token should return 400", function(done) {
		var badCredentials = {
			email : "example1@email.com",
			password : "example1"
		}

		request(app)
		.post("/"+_username+"?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.send(badCredentials)
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Delete user with good credentials token should return 200", function(done) {
		var goodCredentials = {
			email : _email,
			password : _password
		}

		request(app)
		.post("/"+_username+"?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.send(goodCredentials)
		.end(function(error, res) {
			res.should.have.status(200);
			done();
		});
	});
});
