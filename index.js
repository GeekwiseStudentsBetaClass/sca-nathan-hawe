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
    console.log('Application listening on port 3000.');
    
});

/* API */

app.get('/api/getFeatures', function(req, res){
    // Query database for list of features
    
    /* INSERT ERROR CHECKING/HANDLING */
    
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
   
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


app.post('/api/addFeature', function(req, res){
   // Insert document into features collection
   
   /* INSERT ERROR CHECKING/HANDLING */
   
   MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
           
        addFeature(db, req.body, function(err, results){
            
            if(err){
                console.log("There was an error: " + err);
            }
            else{
                res.status(201).send("success");
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
   
        addVote(db, req.body, function(err, results){

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
    // Ensure that doc has an array property for comments
    doc.comments = [];
    
    db.collection('features').insertOne(doc, callback);
}

var getFeatures = function(db, callback){
 
    db.collection('features').find().sort({totalVotes: -1}).toArray(callback);
    
}

var addComment = function(db, doc, callback){
    doc.relatedFeature = require('mongodb').ObjectId(doc.relatedFeature);
    doc.dateCreated = new Date();   // Add date to the comment
    
    db.collection('features').update(
        {_id: doc.relatedFeature},
        {
            $push: {
                comments: {
                    $each: [doc],
                    $slice: -100
                }
            }
        },
        null,
        callback
    );
}


var addVote = function(db, doc, callback){
    doc.dateCreated = new Date();   // Add date to the comment
    doc.relatedFeature = require('mongodb').ObjectId(doc.relatedFeature);
    
    db.collection('votes').insertOne(doc, function(err, results){
        if(doc.isUpVote){
            incrementCount(db, doc.relatedFeature, callback);
        }
        else{
            decrementCount(db, doc.relatedFeature, callback);
        }
    });
}

var incrementCount = function(db, relatedFeature, callback){
    db.collection('features').update(
        {
            _id:relatedFeature
        },
        {
            $inc: { upVotes: 1, totalVotes: 1} 
        },
        null,
        callback
    )
};

var decrementCount = function(db, relatedFeature, callback){
    db.collection('features').update(
        {
            _id:relatedFeature
        },
        {
            $inc: { downVotes: 1, totalVotes: -1} 
        },
        null,
        callback
    )
};
