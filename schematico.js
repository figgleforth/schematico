var express = require("express");
var util = require("./controllers/util");
var bodyParser = require("body-parser");
var app = express().use(bodyParser.json({type:"application/json"}));
util.connectToMongoDB("alpha");
var modelsByRoute = {}; // temporary storage

var UserController = require("./controllers/user");
var RouteController = require("./controllers/route");

app.get("/killall",		UserController.Destroy,
						RouteController.Destroy,
						function(req, res) {
							res.send(200, "Destroyed all Users and Routes.");
						});

app.post("/recover",	UserController.Authenticate,
						UserController.RecoverToken);

app.post("/signup",		UserController.CheckIfEmailExists,
						UserController.CheckIfUsernameExists,
						UserController.CreateNewUser,
						UserController.RecoverToken);

app.get("/:username/:route/:count?",	UserController.ValidateUsername,
										RouteController.GetRoute,
										RouteController.PopulateModel);

app.post("/:username/:route",	RouteController.CheckIfRouteExists,
								UserController.ValidateUsernameAndToken,
								UserController.UserForToken,
								RouteController.CheckIfRouteExists,
								RouteController.CreateRoute);

app.put("/:username/:route",	UserController.ValidateUsernameAndToken,
								UserController.UserForToken,
								RouteController.UpdateRoute);

app.listen(5000);