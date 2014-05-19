var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.schema = mongoose.Schema({
	created : {type:Date, default:new Date().getTime()},
	username : {type:String, unique:true},
	email : {type:String, unique:true},
	salt : String,
	passhash : String,
	routes : [ObjectId],
	token : {type:String, unique:true},
	numberOfRequests : {type:Number, default:0},		// Number of API calls resets daily?
	limitForNumberOfRequests : {type:Number, default:100},	// The limit to their API calls
	tier : {type:Number, default:0}				// Free, Paid, More Paid
});