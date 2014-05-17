var express = require("express");
var stylus = require("stylus");
var util = require("./controllers/util");
var bodyParser = require("body-parser");
var app = express().configure(function() {
	this.set("views", __dirname + "/views");
	this.set("view engine", "jade");
	this.use(bodyParser.json({type:"application/json"}));
	this.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
	this.use(stylus.middleware({
		compress : true,
		src : __dirname + "/public",
		dest : __dirname + "/public"
	}));
	this.use(express.static(__dirname + "/public"));
});
util.connectToMongoDB("alpha");
var modelsByRoute = {}; // temporary storage

var UserController = require("./controllers/user");
var RouteController = require("./controllers/route");

app.get("/killall",		UserController.Destroy,
						RouteController.Destroy,
						function(req, res) {
							res.send(200, "Destroyed all Users and Routes.");
						});

app.get("/routes",	RouteController.GetAll);

app.post("/recover",	UserController.Authenticate,
						UserController.RecoverToken);

app.post("/signup",		UserController.CheckIfEmailExists,
						UserController.CheckIfUsernameExists,
						UserController.CreateNewUser,
						UserController.RecoverToken);

app.get("/:username/routes",	UserController.UserForUsername,
								RouteController.GetRoutes);


app.get("/:username/:route/:count?",	UserController.ValidateUsername,
										RouteController.GetRoute,
										RouteController.PopulateModel);

app.post("/:username/:route",	UserController.ValidateUsernameAndToken,
								UserController.UserForToken,
								RouteController.CheckIfRouteExists,
								RouteController.CreateRoute);

app.put("/:username/:route",	UserController.ValidateUsernameAndToken,
								UserController.UserForToken,
								RouteController.UpdateRoute);

app.listen(5000);