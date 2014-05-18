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
			_newUserToken = res.token;)
			done();
		});
	});

	console.log("_newUserToken:", _newUserToken);

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

	// it("Update a route without token should return 400", function(done) {
	// 	request(app).put("/"+_username+"/"+_route).send({
	// 		"name" : "Name",
	// 		"phone" : "Phone"
	// 	}).expect(200).end(function(error, res) {
	// 		done();
	// 	});
	// });

	// it("Update a route with token should return 200", function(done) {
	// 	request(app).put("/"+_username+"/"+_route+"?token="+_newUserToken).send({
	// 		"name" : "Name",
	// 		"phone" : "Phone"
	// 	}).expect(200).end(function(error, res) {
	// 		done();
	// 	});
	// });

	// it("Delete user without passing token should return 400", function(done) {
	// 	request(app).del("/userByToken")
	// 	.expect(400, done);
	// });

	// it("Delete user with the token should return 200", function(done) {
	// 	request(app).delete("/userByToken?token="+_newUserToken)
	// 	.expect(200, done);
	// });
});