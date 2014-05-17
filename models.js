var mongoose = require("mongoose");

var userSchema = require("./schemas/user");
var routeSchema = require("./schemas/route");

exports.User = mongoose.model("User", userSchema.schema);
exports.Route = mongoose.model("Route", routeSchema.schema);