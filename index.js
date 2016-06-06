var express = require('express');           // Required for routing
var bodyParser = require('body-parser');    // Middleware for populating the req.body property in JSON POST requests

var app = express();

// Add database models
require('./server/models/db');
var routesAPI = require('./server/routes/api');     // Routes needs to be brought in after the models.

// User body-parser so that the req.body property is populated.
app.use(bodyParser.json());

// Allows static pages to be served from the public folder
app.use(express.static('public'));

// Redirect root requests to superCoolApp.html
app.get('/', function(req, res){
     res.redirect('/superCoolApp.html');
 });

// Catch API requests
app.use('/api', routesAPI);


//Set server to listen to port 3000
app.listen(3000, function(){
    console.log('Application listening on port 3000.');
    
});