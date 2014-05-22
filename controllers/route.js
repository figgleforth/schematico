var mongoose = require("mongoose");
var util = require("./util");
var Models = require("../models");
var ObjectId = mongoose.Schema.Types.ObjectId;

function isEmpty(obj) {
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

exports.CreateRoute = function(req, res, next) {
	if (isEmpty(req.body)) {
		res.send(400, "You need to define a schema for this route.");
	} else {
		new Models.Route({
			userId : req.user._id,
			route : req.params.route,
			model : req.body
		}).save(function(error, saved) {
			if (error) util.error(error, res);
			else {
				if (saved) {
					req.user.routes.push(saved._id);
					req.user.save(function(error) {
						if (error) res.send(error);
						else {
							res.send(201, {
								message : "Route successfully created.",
								route : "/"+req.user.username+"/"+saved.route,
								model : saved.model
							});
						}
					});
				} else {
					res.send(400, "Error. Please try again.");
				}
			}
		});
	}
};

exports.UpdateRoute = function(req, res, next) {
	Models.Route.findOne({
		route : req.params.route
	}, function(error, route) {
		if (error) util.error(error, res);
		else {
			if (route) {
				route.model = req.body
				route.save(function(error) {
					if (error) res.send(error);
					else {
						res.send(200, {
							message : "Route successfully updated.",
							route : "/"+req.user.username+"/"+route.route,
							model : route.model
						});
					}
				});
			} else {
				res.send(400, uril.res("That route is not defined."));
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
				res.send(400, util.res("That route is not defined."));
			}
		}
	});
}

exports.DeleteRoute = function(req, res, next) {
	Models.Route.findOne({
		route : req.params.route
	}, function(error, route) {
		if (error) util.error(error, res);
		else {
			if (route) {
				route.remove(function(error) {
					if (error) {
						res.send(400, error);
					} else {
						res.send(200, "Route successfully deleted.");
					}
				});
			} else {
				res.send(400, util.res("That route is not defined."));
			}
		}
	});
}

exports.GetRoutes = function(req, res, next) {
	if (req.user) {
		Models.Route.find({_id : req.user.routes}, function(error, found) {
			if (error) util.error(error, res);
			else {
				if (found) {
					var routesToReturn = {};
					for (var i=0; i<found.length; i++) {
						var route = found[i];
						routesToReturn[route.route] = route.model;
					}
					res.send(200, routesToReturn);
				} else {
					res.send(400, "This user has no routes.");
				}
			}
		});
	} else {
		res.send(400);
	}
}

exports.CheckIfRouteExists = function(req, res, next) {
	Models.Route.count({route:req.params.route, userId:req.user._id}, function(error, count) {
		if (count > 0) {
			res.send(400, util.res("That route is already defined. Make a PUT request to update."));
		} else {
			next();
		}
	});
}

exports.PopulateModel = function(req, res, next) {
	if (req.query.count) {
		var data = [];
		for (var i=0; i<(req.query.count || 1); i++) {
			var dictionary = JSON.parse(JSON.stringify(req.model));
			for (var key in dictionary) {
				dictionary[key] = util.valueForKeyInDictionary(key, dictionary);
			}
			data.push(dictionary);
		}
		res.jsonp(200, data);
	} else {
		var dictionary = JSON.parse(JSON.stringify(req.model));
		for (var key in dictionary) {
			dictionary[key] = util.valueForKeyInDictionary(key, dictionary);
		}
		res.jsonp(200, dictionary);
	}
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

exports.GetAllRoutesEverCreated = function(req, res, next) {
	Models.Route.find({}, function(error, found) {
		if (error) res.send(error);
		else {
			res.send(found);
		}
	});
}

