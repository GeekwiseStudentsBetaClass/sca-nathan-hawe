var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/test';

// Connect to the database
mongoose.connect(url);

// Connection events
mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + url);
});

mongoose.connection.on('error', function(err){
   console.log('Mongoose error: ' + err);
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});

// Include schemas/models
require('./feature');
require('./vote');
require('./user');