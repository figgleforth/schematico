var UserController = require("./controllers/user");
var RouteController = require("./controllers/route");
var express = require("express");
var stylus = require("stylus");
var util = require("./controllers/util");
var bodyParser = require("body-parser");
var scheduler = require("node-schedule");
var app = express();
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");
	app.use(bodyParser.json({type:"application/json"}));
	app.use(stylus.middleware({
		compress : true,
		src : __dirname + "/public",
		dest : __dirname + "/public"
	}));
	app.use(express.static(__dirname + "/public"));
	app.use(function(error, req, res, next) {
		if (error instanceof SyntaxError) {
			res.send(400, "JSON syntax error. Maybe you're missing quotes around the keys?");
		} else {
			next();
		}
	});
}
util.connectToMongoDB("localhost", "alpha");

// DEBUG
app.get("/resetlimits", 		UserController.ResetRateLimitsWithMiddleware);

app.delete("/killall",			UserController.Destroy,
								RouteController.Destroy,
								function(req, res) {
									res.send(200, "Destroyed all Users and Routes.");
								});

// Static Pages //
app.get("/", function(req, res) {
	res.render("index");
});

app.get("/signup", function(req, res) {
	res.render("signup");
});

/**
	Sign up for an account
	@param body 	email, username, password
 */
app.post("/signup",				UserController.CheckIfEmailExists,
								UserController.CheckIfUsernameExists,
								UserController.CreateNewUser,
								function(req, res) {
									res.render("signup", {
										message : "This is your token, use it with all API calls. Attach is as a query to identify yourself. There is a daily limit of 100 requests.",
										token : req.user.token
									});
								});

/**
	Get your token back by authing email and password
	@param username		person's username
 */
app.post("/recover",			UserController.Authenticate,
								UserController.RecoverToken);

/**
	Get all routes as strings
	@param username		person's username
 */
app.get("/:username/routes",	UserController.UserForUsername,
								RouteController.GetRoutes);

/**
	Delete a route
	@param username		person's username
	@query token 		token required to make API calls
 */
app.delete("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.DeleteRoute);

/**
	Delete a username
	@param username		person's username
	@param body 		person's email and password as body
	@query token 		token required to make API calls
 */
app.post("/:username",			UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								UserController.Authenticate,
								UserController.DestroyByToken);

/**
	Get random data for a route
	@param username		person's username
	@query token 		token required to make API calls
	@query count 		(optional) how many model objects you want back
 */
app.get("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								UserController.CheckRequestCountLimit,
								RouteController.GetRoute,
								UserController.IncrementRequestCount,
								RouteController.PopulateModel);

/**
	Create a new route and schema
	@param username		person's username
	@query token 		token required to make API calls
	@body  model 		the model for this route
 */
app.post("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.CheckIfRouteExists,
								RouteController.CreateRoute);

/**
	Update a route with a new schema
	@param username		person's username
	@query token 		token required to make API calls
	@body  model 		the new model for this route
 */
app.put("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.UpdateRoute);

app.listen(5000);

// Schedule API call limit reset
// var limitResetter = scheduler.scheduleJob({hour:24}, function() {
// 	console.log("Resetting every user's rate limits - "+new Date());
// 	UserController.ResetRateLimitsWithoutMiddleware;
// 	console.log("Finished resetting every user's rate limits - "+new Date());
// });

exports.app = app;
exports.UserController = UserController;
exports.RouteController = RouteController;