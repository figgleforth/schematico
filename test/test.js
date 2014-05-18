var supertest = require("supertest");
var assert = require("assert");
var app = require("../schematico.js").app;

describe("Static page", function() {
	describe("index", function() {
		it("should return HTML", function(done) {
			supertest(app)
			.get("/")
			.expect('Content-Type', 'text/html; charset=utf-8')
			.expect(200, done);
		});
	});
});

describe("Account", function() {
	var newUserToken;

	it("Create new user should return 201", function(done) {
		supertest(app).post("/signup").send({
			email : "example@example.com",
			username : "example",
			password : "example"
		}).expect(201).end(function(error, res) {
			assert.notEqual(res.body.token, undefined, "Token is undefined.");
			newUserToken = res.body.token;
			done();
		});
	});

	it("Create new user again should return 400", function(done) {
		supertest(app).post("/signup").send({
			email : "example@example.com",
			username : "example",
			password : "example"
		}).expect(400).end(function(error, res) {
			assert.equal(res.body.token, undefined, "Token is undefined.");
			done();
		});
	});

	it("Delete user without passing token should return 400", function(done) {
		supertest(app).del("/userByToken")
		.expect(400, done);
	});

	it("Delete user with the token should return 200", function(done) {
		supertest(app).del("/userByToken?token="+newUserToken)
		.expect(200, done);
	});
});