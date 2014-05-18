var request = require("supertest");
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
		request(app)
			.post("/signup")
			.set("Content-Type", "application/json")
			.send({
				email : "example@example.com",
				username : _username,
				password : "example"
			})
			.expect(400, done);



		// request(app).post("/signup").send({
		// 	email : "example@example.com",
		// 	username : _username,
		// 	password : "example"
		// }).expect(400).end(function(error, res) {
		// 	assert.notEqual(res.body.token, 1, "Token is undefined.");
		// 	_newUserToken = res.body.token;
		// 	if (error) return done(error);
		// 	done();
		// });
	});

	// it("Create new user again should return 400", function(done) {
	// 	request(app).post("/signup").send({
	// 		email : "example@example.com",
	// 		username : "example",
	// 		password : "example"
	// 	}).expect(400).end(function(error, res) {
	// 		assert.equal(res.body.token, undefined, "Token is undefined.");
	// 		done();
	// 	});
	// });

	// it("Create a new route without schema should return 400", function(done) {
	// 	request(app).post("/"+_username+"/"+_route).expect(400).end(function(error, res) {
	// 		done();
	// 	});
	// });

	// it("Create a new route with improper schema JSON should return 400", function(done) {
	// 	request(app).post("/"+_username+"/"+_route).send({
	// 		name : "Name",
	// 		"phone" : "Phone"
	// 	}).expect(200).end(function(error, res) {
	// 		done();
	// 	});
	// });

	// it("Create a new route with proper schema JSON should return 201", function(done) {
	// 	request(app).post("/"+_username+"/"+_route).send({
	// 		"name" : "Name",
	// 		"phone" : "Phone"
	// 	}).expect(201).end(function(error, res) {
	// 		done();
	// 	});
	// });

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