### Schematico

Create placeholder API routes that return dummy data based on your own specifications.

#### How to use

First make a POST request with the desired URL like `http://bolygon.co:4999/myawesomeroute` and a body like:

```javascript
{
  "name" : "String",
  "age" : "Integer",
  "location" : {
    "longitude" : "Number",
    "latitude" : "Number"
  }
}
```

Then whenever you need this model, just GET `http://bolygon.co:4999/myawesomeroute` and you'll get back an object like:

```javascript
{
  "name" : "Deserunt sunt minim reprehenderit enim ut Lorem.",
  "age" : "26",
  "location" : {
    "longitude" : "342.123516143",
    "latitude" : "123.345634563"
  }
}
```

The model can contain as many nested objects as you want. To get multiple objects back, just append `/<number>` to the API.

#### Available Types

* Number
* -Number (Negative)
* ?Number (Positive or Negative)
* Integer
* -Integer (Negative)
* ?Integer (Positive or Negative)
* Boolean
* Character
* Name
* FirstName
* LastName
* Gender
* Birthday
* Age
* Address
* Zip
* City
* Street
* State
* LongState
* Coordinates
* Latitude
* Longitude
* AreaCode
* Phone
* Company
* HexColor
* RGBColor
* Hash
* GUID
* Dollar
* CreditCardNumber
* CreditCardType
* CreditCardExpiration
* CreditCardExpirationMonth
* CreditCardExpirationYear
* Email
* Username
* Domain
* TLD
* IP
* IPv6
* Avatar
* FacebookID
* TwitterHandle
* Hashtag
* -Date (Past)
* Date (Present)
* +Date (Future)
* ?Date (Past or Future)
* Day
* Month
* Year
* Word
* Words
* Sentence
* Sentences
* Paragraph
* Paragraphs
