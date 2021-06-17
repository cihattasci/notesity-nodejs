var express = require('express');
var app = express();
require('./API/database');
var PORT = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var router = require('./API/Router/routes');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(bodyParser.json());
app.use(express.json());
app.use(router);

app.listen(PORT);