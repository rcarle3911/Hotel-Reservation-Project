var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));

app.listen(3000);
console.log("Server running on port 3000");