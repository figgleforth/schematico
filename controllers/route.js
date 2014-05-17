var mongoose = require("mongoose");
var util = require("./util");
var Models = require("../models");
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.CreateRoute = function(req, res, next) {
	new Models.Route({
		userId : req.user._id,
		route : req.params.route,
		model : req.body.model
	}).save(function(error, saved) {
		if (error) util.error(error, res);
		else {
			if (saved) {
				res.send(200, util.res("Route successfully created.", {
					route : saved.route,
					model : saved.model
				}));
			} else {
				res.send(400, "Error. Please try again.");
			}
		}
	});
};

exports.GetRoute = function(req, res, next) {
	Models.Route.findOne({
		route : req.params.route
	}, function(error, route) {
		if (error) util.error(error, res);
		else {
			if (route) {
				req.model = route.model;
				next();
			} else {
				res.send(400, uril.res("That route is not defined."));
			}
		}
	});
}

exports.PopulateModel = function(req, res, next) {
	var data = [];
	for (var i=0; i<(req.params.count || 1); i++) {
		var dictionary = JSON.parse(JSON.stringify(model));
		for (var key in dictionary) {
			dictionary[key] = util.valueForKeyInDictionary(key, dictionary);
		}
		data.push(dictionary);
	}
	res.send(200, data);
}