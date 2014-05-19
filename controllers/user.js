var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var util = require("./util");
var Models = require("../models");
var ObjectId = mongoose.Schema.Types.ObjectId;
var chance = new require("chance")(function() { return Math.random(); });

exports.ResetRateLimitsWithoutMiddleware = function(req, res, next) {
	Models.User.find({}, function(error, found) {
		if (error) console.log("Error resetting limits: ", error);
		else {
			for (var i = 0; i < found.length; i++) {
				found[i].numberOfRequests = 0;
				found[i].save();
			}
		}
	});
}

exports.ResetRateLimitsWithMiddleware = function(req, res, next) {
	Models.User.find({}, function(error, found) {
		if (error) res.send(400, error);
		else {
			for (var i = 0; i < found.length; i++) {
				found[i].numberOfRequests = 0;
				found[i].save();
			}
			res.send(200, "Rates reset :)");
		}
	});
}

exports.CreateNewUser = function(req, res, next) {
	var salt = bcrypt.genSaltSync(10);
	var passhash = bcrypt.hashSync(req.body.password, salt);
	new Models.User({
		username : req.body.username,
		email : req.body.email,
		salt : salt,
		passhash : passhash,
		token : chance.hash({length:30})
	}).save(function(err, saved) {
		if (err) { res.send(err); }
		else {
			req.user = saved;
			util.sendEmail(saved.email,
				"Your Schematico account has been created",
				"Supply this token with all API calls as a query to identify yourself: "+req.user.token
			);
			res.send(201, {
				message : "This is your token, use it with all API calls. Attach is as a query to identify yourself.",
				token : req.user.token
			});
		}
	});
};

exports.Authenticate = function(req, res, next) {
	Models.User.findOne({
		email : req.body.email
	}, function(error, user) {
		if (error) res.send(error);
		else {
			if (user) {
				if (bcrypt.compareSync(req.body.password, user.passhash)) {
					req.user = user;
					next();
				} else {
					res.send(400, util.res("Password does not match the email."));
				}
			} else {
				res.send(400, util.res("User by that email doesn't exist."));
			}
		}
	});
}

exports.IncrementRequestCount = function(req, res, next) {
	if (req.user) {
		var count = req.user.numberOfRequests;
		count++;
		req.user.numberOfRequests = count;
		req.user.save(function(error) {
			if (error) {
				res.send(500, "Something went wrong. Please try again.");
			} else {
				next();
			}
		});
	} else {
		res.send(400, "Not authenticated.");
	}
}

exports.CheckRequestCountLimit = function(req, res, next) {
	if (req.user) {
		if (req.user.numberOfRequests >= req.user.limitForNumberOfRequests) {
			res.send(400, "Sorry, you have reached your API call limit for the day.");
		} else {
			next();
		}
	} else {
		res.send(400, "Not authenticated.");
	}
}

exports.RecoverToken = function(req, res, next) {
	if (req.user) {
		res.send(200, req.user.token);
	} else {
		res.send(400, "Not authenticated.");
	}
}

exports.CheckIfEmailExists = function(req, res, next) {
	Models.User.count({email:req.body.email}, function(error, count) {
		if (count > 0) {
			res.send(400, util.res("That email is already in use."));
		} else {
			next();
		}
	});
};

exports.CheckIfUsernameExists = function(req, res, next) {
	Models.User.count({username:req.body.username}, function(error, count) {
		if (count > 0) {
			res.send(400, util.res("That username is already in use."));
		} else {
			next();
		}
	});
}

exports.UserForToken = function(req, res, next) {
	Models.User.findOne({token:req.body.token}, function(error, found) {
		if (error) res.send(error);
		else {
			if (found) {
				req.user = found;
				next();
			} else {
				res.send(400, utils.res("User does not exist for this userID."));
			}
		}
	});
}

exports.ValidateTokenInQuery = function(req, res, next) {
	if (!req.query.token) {
		res.send(400, util.res("You must supply a valid token."));
	}
	Models.User.count({token:req.query.token}, function(error, count) {
		if (count > 0) {
			next();
		} else {
			res.send(400, util.res("That token does not exist. You may need to recover your token, or you may not be signed up."));
		}
	});
}

exports.ValidateUsername = function(req, res, next) {
	Models.User.count({username:req.params.username}, function(error, count) {
		if (count > 0) {
			next();
		} else {
			res.send(400, util.res("That username does not exist."));
		}
	});
}

exports.ValidateUsernameAndToken = function(req, res, next) {
	Models.User.count({username:req.params.username, token:req.body.token}, function(error, count) {
		if (count > 0) {
			next();
		} else {
			res.send(400, util.res("That token does not exist, or that username is not registered. You may need to recover your token, or you may not be signed up."));
		}
	});
}

exports.UserForUsername = function(req, res, next) {
	Models.User.findOne({username:req.params.username}, function(error, found) {
		if (found) {
			req.user = found;
			next();
		} else {
			res.send(400, util.res("That user does not exist."));
		}
	});
}

// NEVER DO This
exports.DestroyByToken = function(req, res, next) {
	if (!req.query.token) {
		res.send(400);
	} else {
		Models.User.find({token : req.query.token}, function(error, found) {
			if (error) res.send(error);
			else {
				for (var i = 0; i < found.length; i++) {
					found[i].remove();
				}
				res.send(200);
			}
		});
	}
}

exports.Destroy = function(req, res, next) {
	Models.User.find({}, function(error, found) {
		if (error) res.send(error);
		else {
			for (var i = 0; i < found.length; i++) {
				found[i].remove();
			}
			next();
		}
	});
}