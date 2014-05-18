var supertest = require("supertest");
var express = require("express");
var assert = require("assert");

var app = require("../schematico.js");

describe("GET /", function() {
	it("should return 200", function(done) {
		supertest(app).get("/").expect(200, done);
	});
});
