var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var utils = require("./utils");
var Models = require("../models");
var ObjectId = mongoose.Schema.Types.ObjectId;
var chance = new require("chance")(function() { return Math.random(); });

exports.UserForId = function(req, res, next) {
	Models.User.findById(req.userId, function(error, found) {
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

exports.CreateNewUser = function(req, res, next) {
	var salt = bcrypt.genSaltSync(10);
	var passhash = bcrypt.hashSync(req.body.password, salt);
	new Models.User({
		email : req.body.email,
		salt : salt,
		passhash : passhash,
		token : chance.hash({length:30})
	}).save(function(err, saved) {
		if (err) { res.send(err); }
		else {
			req.token = saved.token;
			utils.sendEmail(saved.email, "Schematico Account Created", "Your free account is now ready to use. Supply this token with all API calls to identify yourself: "+req.token);
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