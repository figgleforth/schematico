var faker = require("Faker");
var lorem = require("lorem-ipsum");

function _valueForKeyInDictionary(key, dictionary) {
	if (typeof dictionary[key] === "string") {
		var value = undefined;
		switch(dictionary[key]) {
			case "Name":
				value = faker.Name.findName();
				break;
			case "FirstName":
				value = faker.Name.firstName();
				break;
			case "LastName":
				value = faker.Name.lastName();
				break;
			case "Zip":
				value = faker.Address.zipCode();
				break;
			case "City":
				value = faker.Address.city();
				break;
			case "Street":
				value = faker.Address.streetName();
				break;
			case "State":
				value = faker.Address.usState();
				break;
			case "Latitude":
				value = faker.Address.latitude();
				break;
			case "Longitude":
				value = faker.Address.longitude();
				break;
			case "Phone":
				value = faker.PhoneNumber.phoneNumber();
				break;
			case "Email":
				value = faker.Internet.email();
				break;
			case "Username":
				value = faker.Internet.userName();
				break;
			case "Domain":
				value = faker.Internet.domainName();
				break;
			case "IP":
				value = faker.Internet.ip();
				break;
			case "Company":
				value = faker.Company.companyName();
				break;
			case "Avatar":
				value = faker.Image.avatar();
				break;
			case "Word":
				value = lorem({
					count : 1,
					units : "words",
					format : "plain"
				});
				break;
			case "Words":
				value = faker.Lorem.words();
				break;
			case "Sentence":
				value = faker.Lorem.sentence();
				break;
			case "Sentences":
				value = lorem({
					count : Math.round(Math.random()*5),
					units : "sentences",
					format : "plain"
				});
				break;
			case "Paragraph":
				value = lorem({
					count : 1,
					units : "paragraphs",
					format : "plain"
				});
				break;
			case "Paragraphs":
				value = lorem({
					count : Math.round(Math.random()*5),
					units : "paragraphs",
					format : "plain"
				});
				break;
			case "-Date":
				value = faker.Date.past(Math.round(Math.random()*100));
				break;
			case "Date":
				value = new Date();
				break;
			case "+Date":
				value = faker.Date.future(Math.round(Math.random()*100));
				break;
			case "Number":
				value = Math.random()*1000;
				break;
			case "-Number":
				value = (Math.random()*1000) * -1;
				break;
			case "Integer" :
				value = Math.round(Math.random()*1000);
				break;
			case "-Integer" :
				value = Math.round(Math.random()*1000) * -1;
				break;
			case "Boolean":
				value = (Math.random() >= 0.5);
				break;
			default:
				value = "Undefined data type.";
				break;
		}
		return value;
	} else if (typeof dictionary[key] === "object") {
		if (Array.isArray(dictionary[key])) {

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