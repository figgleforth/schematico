var express = require("express");
var util = require("./util");
var bodyParser = require("body-parser");
var app = express().use(bodyParser.json({type:"application/json"}));

var modelsByRoute = {};
var units = ["words", "sentences", "paragraphs"];


app.get("/:path/:count?", function(req, res) {
	var model = modelsByRoute[req.params.path];
	if (model) {
		var data = [];
		for (var i=0; i<(req.params.count || 1); i++) {
			var dictionary = JSON.parse(JSON.stringify(model));
			for (var key in dictionary) {
				dictionary[key] = util.valueForKeyInDictionary(key, dictionary);
			}
			data.push(dictionary);
		}
		res.send(200, data);
	} else {
		res.send(400, {
			message : "Route is undefined."
		});
	}
});

app.post("/:path", function(req, res) {
	var model = modelsByRoute[req.params.path];
	if (model) {
		res.send(400, {
			message : "Route is already defined. Make a PUT request to update."
		});
	} else {
		modelsByRoute[req.params.path] = req.body;
		res.send(200, {
			message : "Route successfully created."
		});
	}
});

app.put("/:path", function(req, res) {
	modelsByRoute[req.params.path] = req.body;
	res.send(200, {
		message : "Route successfully updated."
	});
});

app.listen(5000);