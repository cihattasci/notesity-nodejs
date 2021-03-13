var express = require('express');
var app = express();
require('./API/database');
var PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var router = require('./API/Router/routes');

app.use(bodyParser.json());
app.use(express.json());
app.use(router);

app.listen(PORT);