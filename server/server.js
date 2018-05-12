var express = require('express');
var app = express();
var fs = require("fs");
var redis = require('redis');

var server = app.listen(8081, "localhost", function () {

    var host = server.address().address
    var port = server.address().port
  
    console.log("Example app listening at http://%s:%s", host, port)     
    createDatabase();
  })
    
var client = redis.createClient(6379, '127.0.0.1');
client.on('connect', function () {
    console.log('connected');
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

function createDatabase() {
    client.keys('*', function (err, keys) {
        if (err) return console.log(err);
       if (keys.length == 0){
        console.log("Creating db...");
        persons.forEach(element => {
            client.hmset('person:'+element.id, 'id', element.id, 'name', element.name, 'surname', element.surname, 'birthDate',element.birthDate, function (err, res) {});
        });
       }
    });
    
}

app.get('/listPersons', function (req, res) {
    console.log('GET method');
    readPersons = new Array();
    client.keys('*', function (err, keys) {
        if (err) return console.log(err);
        var numElements = keys.length;
        keys.forEach(element => {
            client.hgetall(element, function (err, reply) {
                if (!err) {
                    readPersons.push(reply);
                    if (numElements == 1) {
                        res.end(JSON.stringify(readPersons));
                    }
                    numElements--;
                }
            });
        });
    });
})

app.post('/addPerson', function (req, res) {
    console.log('POST method');
    req.on('data',function (data){
        console.log(JSON.parse( data ));
        var person = JSON.parse(data);
        client.hmset('person:'+person.id, 'id', person.id, 'name', person.name, 'surname', 
                        person.surname, 'birthDate', person.birthDate, function (err, res) {});
    })
 })

 app.delete('/deletePerson/:id', function (req, res) {
    console.log('DELETE method');
    console.log(req.params.id);
    client.hdel('person:'+req.params.id, 'id', 'name', 'surname', 'birthDate', function(){
        console.log("Done");
        res.end("Done on redis");
    });
 }) 



function initializeData() {
    
    client.set("string key", "string val", redis.print);
    client.get("string key", function (err, reply) {
        console.log(reply.toString()); 
    });
}


persons=[
    {
      id : 0,
      name : 'Daniele',
      surname : 'Scaramuzzi',
      birthDate : new Date(1994,1,10)
    },
    {
      id : 1,
      name : 'Mario',
      surname : 'Rossi',
      birthDate : new Date(1988,10,7)
    },
    {
      id : 2,
      name : 'Nicola',
      surname : 'Verde',
      birthDate : new Date(1972,4,24)
    },
    {
      id : 3,
      name : 'Luca',
      surname : 'Giallo',
      birthDate : new Date(1982,9,1)
    },
    {
      id : 4,
      name : 'Andrea',
      surname : 'Blu',
      birthDate : new Date(1992,7,13)
    }
  ]


