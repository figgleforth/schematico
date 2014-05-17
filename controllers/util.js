var nodemailer = require("nodemailer");
var mongoose = require("mongoose");
var faker = require("Faker");
var lorem = require("lorem-ipsum");
var chance = new require("chance")(function() { return Math.random(); });
var moment = require("moment");
moment().format();

function _valueForKeyInDictionary(key, dictionary) {
	if (typeof dictionary[key] === "string") {
		var value = undefined;
		switch(dictionary[key]) {

			// Basic
			case "Number":
				value = Math.random()*Number.MAX_VALUE;
				break;
			case "-Number":
				value = (Math.random()*Number.MAX_VALUE) * -1;
				break;
			case "Integer" :
				value = Math.round(Math.random()*Number.MAX_VALUE);
				break;
			case "-Integer" :
				value = Math.round(Math.random()*Number.MAX_VALUE) * -1;
				break;
			case "Boolean":
				value = chance.bool();
				break;
			case "Character":
				value = chance.character();
				break;

			// Text
			case "Word":
				value = chance.word();
				break;
			case "Words":
				value = faker.Lorem.words();
				break;
			case "Sentence":
				value = faker.Lorem.sentence();
				break;
			case "Sentences":
				// chance doesnt have sentences, its the same as a paragraph essentially
				value = lorem({
					count : 2 + Math.round(Math.random()*5),
					units : "sentences",
					format : "plain"
				});
				break;
			case "Paragraph":
				value = chance.paragraph();
				break;
			case "Paragraphs":
				// Keep using lorem because it includes line breaks
				value = lorem({
					count : Math.round(Math.random()*5),
					units : "paragraphs",
					format : "plain"
				});
				break;

			// Finance
			case "Dollar":
				value = chance.dollar();
				break;
			case "CreditCardNumber":
				value = chance.cc();
				break;
			case "CreditCardType":
				value = chance.cc_type();
				break;
			case "CreditCardExpiration":
				value = chance.exp();
				break;
			case "CreditCardExpirationMonth":
				value = chance.exp_month();
				break;
			case "CreditCardExpirationYear":
				value = chance.exp_year();
				break;

			// Person
			case "Name":
				value = chance.name();
				break;
			case "FirstName":
				value = chance.first();
				break;
			case "LastName":
				value = chance.last();
				break;
			case "Gender":
				value = chance.gender();
				break;
			case "Birthday":
				value = chance.birthday();
				break;
			case "Age":
				value = chance.age();
				break;

			// Personal info
			case "Address":
				value = chance.address();
				break;
			case "Zip":
				value = chance.zip();
				break;
			case "City":
				value = chance.city();
				break;
			case "Street":
				value = chance.street();
				break;
			case "State":
				value = chance.state();
				break;
			case "LongState":
				value = chance.state({full: true});
				break;
			case "Coordinates":
				value = chance.coordinates();
				break;
			case "Latitude":
				value = chance.latitude();
				break;
			case "Longitude":
				value = chance.longitude();
				break;
			case "AreaCode":
				value = chance.areacode();
				break;
			case "Phone":
				value = chance.phone();
				break;
			case "Email":
				value = chance.email();
				break;
			case "Company":
				value = faker.Company.companyName();
				break;

			// Internet
			case "Username":
				value = faker.Internet.userName();
				break;
			case "Domain":
				value = chance.domain();
				break;
			case "TLD":
				value = chance.tld();
				break;
			case "IP":
				value = chance.ip();
				break;
			case "IPv6":
				value = chance.ipv6();
				break;
			case "Avatar":
				value = faker.Image.avatar();
				break;
			case "FacebookID":
				value = chance.fbid();
				break;
			case "TwitterHandle":
				value = chance.twitter();
				break;
			case "Hashtag":
				value = chance.hashtag();
				break;

			// Color
			case "HexColor":
				value = chance.color({format: "hex"});
				break;
			case "RGBColor":
				value = chance.color({format: "rgb"});
				break;

			
			// Dates
			case "-Date":
				value = faker.Date.past(1 + Math.round(Math.random()*100));
				break;
			case "Date":
				value = new Date();
				break;
			case "+Date":
				value = faker.Date.future(1 + Math.round(Math.random()*100));
				break;
			case "Day":
				value = moment().dayOfYear();
				break;
			case "Month":
				value = chance.month();
				break;
			case "Year":
				value = chance.year();
				break;
			
			// Other
			case "Hash":
				value = chance.hash({length:25});
				break;
			case "GUID":
				value = chance.guid();
				break;

			default:
				value = "Undefined data type.";
				break;
		}
		return value;
	} else if (typeof dictionary[key] === "object") {
		if (Array.isArray(dictionary[key])) {
			var subdictionary = dictionary[key][0];
			var count = dictionary[key][1] ? dictionary[key][1] : (1 + Math.round(Math.random()*10));

			var data = [];
			var subdictionary = JSON.parse(JSON.stringify(subdictionary));
			for (var i=0; i<count; i++) {
				var newDict = {};
				for (var subkey in subdictionary) {
					newDict[subkey] = _valueForKeyInDictionary(subkey, subdictionary);
				}
				data.push(newDict);
			}
			return data;
		} else {
			var value = {};
			for (var subkey in dictionary[key]) {
				value[subkey] = _valueForKeyInDictionary(subkey, dictionary[key]);
			}
			return value;
		}

	}
}

exports.valueForKeyInDictionary = _valueForKeyInDictionary;

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "schematico.co@gmail.com",
        pass: "enfwlkkbvmtseqmp"
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
		retVal[data] = data;
	}
	return retVal;
}