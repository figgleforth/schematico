var supertest = require("supertest");
var assert = require("assert");
var app = require("../schematico.js").app;

describe("Static pages", function() {
	describe("GET /", function() {
		it("should return HTML", function(done) {
			supertest(app)
			.get("/")
			.expect('Content-Type', 'text/html; charset=utf-8')
			.expect(200, done);
		});
	});
});
