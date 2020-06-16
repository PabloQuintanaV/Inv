const https = require("https");
const fs = require("fs");
const express = require('express');
const app = express();

const options ={ key: fs.readFileSync("key.pem"),
		 cert:fs.readFileSync("cert.pem")};

var server = https.createServer(options,app);

app.get('/', function(req, res, next) {
	res.send("hello World https");
});

server.listen(8000, function(req,res) {
  	console.log('Aplicación running, escuchando el puerto 443!');
});

/*
const https = require("https");
const http = require("http");
const express = require('express');
const app = express();
const fs = require("fs");

const options ={ key: fs.readFileSync("server.key"),    //key.pem"),
		 cert:fs.readFileSync("server.cert") }; //cert.pem")};
var server = https.createServer(options,app);
var serverhttp = http.createServer(app);

app.get('/', function(req, res, next) {
	res.send("hello World https");
});
server.listen(8443, function(req,res) {
  	console.log('Aplicación running, escuchando el puerto 8443!');
});
serverhttp.listen(8080, function(req,res) {
  	console.log('Aplicación running, escuchando el puerto 8080!');
});

*/