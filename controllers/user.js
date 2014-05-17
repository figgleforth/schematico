var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var utils = require("./utils");
var Models = require("../models");
var ObjectId = mongoose.Schema.Types.ObjectId;
var chance = new require("chance")(function() { return Math.random(); });

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
			utils.sendEmail(saved.email, "Schematico Account Created", "Your free account is now ready to use. Supply this token with all API calls to identify yourself: "+req.user.token);
			next();
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
					res.send(400, utils.res("Password does not match the email."));
				}
			} else {
				res.send(400, utils.res("User by that email doesn't exist."));
			}
		}
	});
}

exports.CheckIfEmailExists = function(req, res, next) {
	Models.User.count({email:req.body.email}, function(error, count) {
		if (count > 0) {
			res.send(400, utils.res("That email is already in use."));
		} else {
			next();
		}
	});
};

exports.CheckIfUsernameExists = function(req, res, next) {
	Models.User.count({username:req.body.username}, function(error, count) {
		if (count > 0) {
			res.send(400, utils.res("That username is already in use."));
		} else {
			next();
		}
	});
}

exports.RecoverToken = function(req, res, next) {
	res.send(200, {
		message : "This is your token, use it with all API calls.",
		token : req.user.token
	});
}