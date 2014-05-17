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
				res.send(200, {
					message : "Route successfully created.",
					route : saved.route,
					model : saved.model
				}));
			} else {
				res.send(400, "Error. Please try again.");
			}
		}
	});
};

exports.UpdateRoute = function(req, res, next) {
	req.route.model = req.body.model;
	req.route.save(function(error, saved) {
		if (error) util.error(error, res);
		else {
			if (saved) {
				res.send(200, {
					message : "Route successfully updated.",
					route : saved.route,
					model : saved.model
				}));
			} else {
				res.send(400, "Error. Please try again.");
			}
		}
	});
}

exports.GetRoute = function(req, res, next) {
	Models.Route.findOne({
		route : req.params.route
	}, function(error, route) {
		if (error) util.error(error, res);
		else {
			if (route) {
				req.route = route;
				req.model = route.model;
				next();
			} else {
				res.send(400, uril.res("That route is not defined."));
			}
		}
	});
}

exports.CheckIfRouteExists = function(req, res, next) {
	Models.User.count({route:req.params.route}, function(error, count) {
		if (count > 0) {
			res.send(400, util.res("That route is already defined. Make a PUT request to update."));
		} else {
			next();
		}
	});
}

exports.PopulateModel = function(req, res, next) {
	var data = [];
	for (var i=0; i<(req.params.count || 1); i++) {
		var dictionary = JSON.parse(JSON.stringify(req.model));
		for (var key in dictionary) {
			dictionary[key] = util.valueForKeyInDictionary(key, dictionary);
		}
		data.push(dictionary);
	}
	res.send(200, data);
}

// NEVER DO This
exports.Destroy = function(req, res, next) {
	Models.Route.find({}, function(error, found) {
		if (error) res.send(error);
		else {
			for (var i = 0; i < found.length; i++) {
				found[i].remove();
			}
			next();
		}
	});
}