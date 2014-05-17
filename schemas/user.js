var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.schema = mongoose.Schema({
	created : {type:Date, default:new Date().getTime()},
	username : {type:String, unique:true},
	email : {type:String, unique:true},
	salt : String,
	passhash : String,
	routes : [ObjectId],
	token : {type:String, unique:true},	// used with all api calls, can be recovered
	requests : Number,	// Number of API calls resets daily?
	tier : Number	// Free, Paid, More Paid
});