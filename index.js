var express = require('express');           // Required for routing
var bodyParser = require('body-parser');    // Middleware for populating the res.body property in JSON POST requests

var app = express();

// Allows static pages to be served from the public folder
app.use(express.static('public'));

// User body-parser
app.use(bodyParser.json());


// Redirects root requests to superCoolApp.html
app.get('/', function(req, res){
     res.redirect('/superCoolApp.html');
 });


// Set server to listen to port 3000
app.listen(3000, function(){
    console.log('Example app listening on port 3000!');
    
});

/* API */
app.get('/api/getFeatures', function(req, res){
    // Query database for list of features
    
    /* INSERT ERROR CHECKING/HANDLING */
    
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log("Connected correctly for getFeatures.");
   
        getFeatures(db, function(err, docs){
            if(err){
                console.log("There was an error: " + err);
            }
            else{
                res.status(200).json(docs);
            }
            
            db.close();
        });
    }); 
});

app.get('/api/getJoin', function(req, res){
    // Query database for list of features
    
    /* INSERT ERROR CHECKING/HANDLING */
    
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log("Connected correctly for join.");
   
        join(db, function(err, docs){
            if(err){
                console.log("There was an error: " + err);
            }
            else{
                res.status(200).json(docs);
            }
            
            db.close();
        });
    }); 
});


app.post('/api/addFeature', function(req, res){
   // Insert document into features collection
   
   /* INSERT ERROR CHECKING/HANDLING */
   
   MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log("Connected correctly for addFeature.");
   
        addFeature(db, req.body, function(err, results){
            console.log("Err: " + err);
            console.log("Results: " + results);
            if(err){
                console.log("There was an error: " + err);
            }
            else{
                console.log(results);
                res.status(201).send("success");
            }
            
            db.close();
        });
    });
});

app.post('/api/getComments', function(req, res){
    // Query database for list of comments for feature passed
    
    /* INSERT ERROR CHECKING/HANDLING */
    
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log("Connected correctly for getComments.");
   
        getComments(db, req.body, function(err, docs){
            if(err){
                console.log("There was an error: " + err);
            }
            else{
                res.status(200).json(docs);
            }
            
            db.close();
        });
    });
});

app.post('/api/addComment', function(req, res){
   // Insert document into comments collection
   
   /* INSERT ERROR CHECKING/HANDLING */
   
   MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log("Connected correctly for addComment.");
   
        addComment(db, req.body, function(err, results){
            console.log("Err: " + err);
            console.log("Results: " + results);
            if(err){
                console.log("There was an error: " + err);
            }
            else{
                console.log(results);
                res.status(201).send("success");
            }
            
            db.close();
        });
    });
});

app.post('/api/addVote', function(req, res){
   // Insert document into votes collection
   
   /* INSERT ERROR CHECKING/HANDLING */
   // Need to ensure there's a valid user and valid related feature
   
   MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log("Connected correctly for addVote.");
   
        addVote(db, req.body, function(err, results){
            console.log("Err: " + err);
            console.log("Results: " + results);
            if(err){
                console.log("There was an error: " + err);
            }
            else{
                console.log(results);
                res.status(201).send("success");
            }
            
            db.close();
        });
    });
});

/* Database stuff */
var MongoClient = require('mongodb').MongoClient;
var MongoId = require('mongodb').MongoId;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
var addVote = function(db, doc, callback){
    db.collection('votes').insertOne(doc, callback);
}


var addFeature = function(db, doc, callback){
    db.collection('features').insertOne(doc, callback);
}

var getFeatures = function(db, callback){
    // Return all features sorted descending by score and ascending by name
    db.collection('features')
        .find( {"hidden": {$ne: true} })
        .sort( {"score":-1,"name":1} )
        .toArray(callback);
}

var addComment = function(db, doc, callback){
    doc.dateCreated = new Date();   // Add date to the comment
    doc.relatedFeature = require('mongodb').ObjectId(doc.relatedFeature);
    db.collection('comments').insertOne(doc, callback);
}

var getComments = function(db, query, callback){
    console.log(query);
    query.relatedFeature = require('mongodb').ObjectId(query.relatedFeature);
    // Return all comments with the passed query
    db.collection('comments')
        .find(query)
        .sort( {"dateCreated":1} )
        .toArray(callback);
}

var join = function(db, callback){
    console.log('attempting join');
    
    db.collection('features').aggregate([
        {$lookup:
            {
                from: "comments",
                localField: "_id",
                foreignField: "relatedFeature",
                as: "featureComments"
            }
        }
    ]).toArray(callback);
    
    
}
var insertDocument = function(db, callback){
    var collection = "features"
    db.collection(collection).insertMany([
        {"name":"Login with Facebook","description":"Use Facebook's login service with Super Cool App."},
        {"name":"Twitter Feed","description":"Display the active user's twitter feed."},
        {"name":"Threaded Comments","description":"Use threaded comments in the comment system."},
        {"name":"Today's Weather","description":"Display today's weather using the Weather.com API and the user's zipcode."},
        {"name":"Profile Photos","description":"Allow users to upload profile photos."}
    ], function(err, result){
        assert.equal(err, null);
        console.log("Inserted a document into the " + collection + " collection.");
        callback();
    });
};