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

* String
* Word
* Sentence
* Paragraph
* Number
* Integer
* -Integer
* Boolean

#### Todo

* User accounts so that routes can be persistent, really basic auth.
* More types
  * Name
  * Address
  * Phone
  * City
  * State
  * Country
  * Continent
  * Zip code
  * Language
  * Time
  * Date
