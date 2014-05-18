var UserController = require("./controllers/user");
var RouteController = require("./controllers/route");
var express = require("express");
var stylus = require("stylus");
var util = require("./controllers/util");
var bodyParser = require("body-parser");
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
}
util.connectToMongoDB("localhost", "alpha");

// Testing
app.get("/200", function(req, res) {
	res.send(200);
});

app.get("/400", function(req, res) {
	res.send(400);
});

// Static Pages //
app.get("/", function(req, res) {
	res.render("index");
});

// Account //
app.post("/signup",				UserController.CheckIfEmailExists,
								UserController.CheckIfUsernameExists,
								UserController.CreateNewUser);

	
// Debug API //
app.delete("/killall",			UserController.Destroy,
								RouteController.Destroy,
								function(req, res) {
									res.send(200, "Destroyed all Users and Routes.");
								});

app.delete("/userByToken",		UserController.DestroyByToken);

// app.get("/routes",				RouteController.GetAllRoutesEverCreated);

// app.get("/:username/routes",	UserController.UserForUsername,
								// RouteController.GetRoutes);


// Product API //
/**
	@param username		person's username
	@query token 		token required to make API calls
	@query count 		(optional) how many model objects you want back
 */
app.get("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.GetRoute,
								RouteController.PopulateModel);

/**
	@param username		person's username
	@query token 		token required to make API calls
	@body  model 		the model for this route
 */
app.post("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.CheckIfRouteExists,
								RouteController.CreateRoute);

/**
	@param username		person's username
	@query token 		token required to make API calls
	@body  model 		the new model for this route
 */
app.put("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.UpdateRoute);


app.listen(5000);
exports.app = app;
