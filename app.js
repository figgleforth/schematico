var express = require("express");
var lorem = require("lorem-ipsum");
var bodyParser = require("body-parser");
var app = express().use(bodyParser.json({type:"application/json"}));

var modelsByRoute = {};
var units = ["words", "sentences", "paragraphs"];

app.get("/:path/:count", function(req, res) {
	var model = modelsByRoute[req.params.path];
	if (model) {
		var data = [];
		for (var i=0; i<req.params.count; i++) {
			var instance = JSON.parse(JSON.stringify(model));
			for (var key in instance) {
				instance[key] = valueForKey(key, instance);
			}
			data.push(instance);
		}
		res.send(200, data);
	} else {
		res.send(400, {
			message : "Route is undefined."
		});
	}
});

function valueForKey(key, dictionary) {
	if (typeof dictionary[key] === "string") {
		var value = undefined;
		switch(dictionary[key]) {
			case "String":
				value = lorem({
					count : Math.random()*15,
					units : units[Math.floor(Math.random()*units.length)],
					format : "plain"
				});
				break;
			case "Word":
				value = lorem({
					count : 1,
					units : "words",
					format : "plain"
				});
				break;
			case "Sentence":
				value = lorem({
					count : 1,
					units : "sentences",
					format : "plain"
				});
				break;
			case "Paragraph":
				value = lorem({
					count : 1,
					units : "paragraphs",
					format : "plain"
				});
				break;
			case "Number":
				value = Math.random()*1000;
				break;
			case "Integer" :
				value = Math.round(Math.random()*1000);
				break;
			case "-Integer" :
				value = Math.round(Math.random()*1000) * -1;
				break;
			case "Boolean":
				value = (Math.random() >= 0.5);
				break;
		}
		return value;
	} else if (typeof dictionary[key] === "object") {
		if (Array.isArray(dictionary[key])) {

		} else {
			var value = {};
			for (var subkey in dictionary[key]) {
				value[subkey] = valueForKey(subkey, dictionary[key]);
			}
			return value;
		}

	}
}

app.post("/:path", function(req, res) {
	var model = modelsByRoute[req.params.path];
	if (model) {
		res.send(400, {
			message : "Route is already defined. Make a PUT request to update."
		});
	} else {
		modelsByRoute[req.params.path] = req.body.model;
		res.send(200, {
			message : "Route successfully created."
		});
	}
});

app.put("/:path", function(req, res) {
	modelsByRoute[req.params.path] = req.body.model;
	res.send(200, {
		message : "Route successfully updated."
	});
});

app.listen(process.env.PORT || 1337);