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
util.connectToMongoDB("alpha");
var modelsByRoute = {}; // temporary storage

var UserController = require("./controllers/user");
var RouteController = require("./controllers/route");

app.get("/", function(req, res) {
	res.render("index");
});

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


// done
// /username/route?token=abcdef&count=123
app.get("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.GetRoute,
								RouteController.PopulateModel);

// done
// /username/route?token=abcdef
// body is the model
app.post("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.CheckIfRouteExists,
								RouteController.CreateRoute);

// /username/route?token=abcdef
// body is the new model
app.put("/:username/:route",	UserController.UserForUsername,
								UserController.ValidateTokenInQuery,
								RouteController.UpdateRoute);

app.listen(5000);