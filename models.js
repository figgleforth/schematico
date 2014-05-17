var mongoose = require("mongoose");

var userSchema = require("./schemas/user");

exports.User = mongoose.model("User", userSchema.schema);