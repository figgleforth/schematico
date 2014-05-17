###Schematico

Create placeholder API routes that return dummy data based on your own specifications.

####How to use

First make a POST request with the desired URL like `http://bolygon.co/schematico/myawesomeroute` and with a body like:

```javascript
{
  "name" : "String",
  "age" : "Integer"
  "location" : {
    "longitude" : "Number",
    "latitude" : "Number"
  }
}
```

Then whenever you need this model, just GET `http://bolygon.co/schematico/myawesomeroute` and you'll get back an object like:

```javascript
{
  "name" : "Deserunt sunt minim reprehenderit enim ut Lorem.",
  "age" : "26"
  "location" : {
    "longitude" : "342.123516143",
    "latitude" : "123.345634563"
  }
}
```

The model can contain as many nested objects as you want. To get multiple objects back, just append `/<number>` to the API.
