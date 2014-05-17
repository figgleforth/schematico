var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.schema = mongoose.Schema({
	created : {type:Date, default:new Date().getTime()},
	userId : ObjectId,
	route : String,
	model : Object
});