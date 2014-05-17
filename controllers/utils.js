var nodemailer = require("nodemailer");
var mongoose = require("mongoose");

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "bpercevic@gmail.com",
        pass: "rcowoedgmqlrnlap"
    }
});

var mailOptions = {
    from: "Events", // sender address
    to: "percevic@me.com", // list of receivers
    subject: "", // Subject line
    text: "Yay", // plaintext body
}

exports.sendEmail = function(to, subject, text) {
	mailOptions.to = to;
	mailOptions.subject = subject;
	mailOptions.text = text;
	smtpTransport.sendMail(mailOptions, function(error, response){
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
		}
		smtpTransport.close(); // shut down the connection pool, no more messages
	});
}

exports.connectToMongoDB = function(name) {
	mongoose.connect("mongodb://localhost/"+name);
	mongoose.connection.on("error", function(error) {
		console.log("Mongo database '"+name+"' connection FAIL.", error);
	});
	mongoose.connection.on("open", function() {
		console.log("Mongo database '"+name+"' connection OK.");
	});
}

exports.error = function(error, res) {
	if (error) {
		res.send(error);
	}
}

exports.res = function(message, data) {
	var retVal = {
		message : message
	};
	if (data) {
		retVal["data"] = data;
	}
	return retVal;
}
