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
	var _username = "example";
	var _route = "example";
	var _newUserToken;

	it("Create new user should return 201", function(done) {
		var newUser = {
			email : "example@email.com",
			username : _username,
			password : "example"
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
			email : "example@email.com",
			username : _username,
			password : "example"
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

	it("Create another user with the same details should return 400", function(done) {
		var newUser = {
			email : "example@email.com",
			username : _username,
			password : "example"
		}

		request(app)
		.post("/signup")
		.set("Content-Type", "application/json")
		.send(newUser)
		.end(function(error, res) {
			res.should.have.status(400);
			res.body.should.not.have.property("token");
			_newUserToken = res.body.token;
			done();
		});
	});

	it("Creating a new route with a schema and with token should return 400 because the previous test did not get a token back", function(done) {
		var newSchema = {
			name : "Name",
			email : "Email"
		}

		request(app)
		.post("/"+_username+"/"+_route+"?token="+_newUserToken)
		.set("Content-Type", "application/json")
		.send(newSchema)
		.end(function(error, res) {
			res.should.have.status(400);
			done();
		});
	});

	it("Recover token with good credentials should return 200", function(done) {
		var goodCredentials = {
			email : "example@email.com",
			password : "example"
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
});