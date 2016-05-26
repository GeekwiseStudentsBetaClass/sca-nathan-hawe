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

app.get('/api/getComments', function(req, res){
    // Query database for list of comments for feature passed
    
    /* INSERT ERROR CHECKING/HANDLING */
    
    MongoClient.connect(url, function(err, db){
        assert.equal(null, err);
        console.log("Connected correctly for getComments.");
   
        getComments(db, function(err, docs){
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
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
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
    doc.dateCreated = new Date();
    db.collection('comments').insertOne(doc, callback);
}

var getComments = function(db, callback){
    // Return all features sorted descending by score and ascending by name
    db.collection('comments')
        .find( {"hidden": {$ne: true} })
        .sort( {"dateCreated":1} )
        .toArray(callback);
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

var findRestaurants = function(db, callback){
    //var cursor = db.collection('restaurants').find( );    // Returns all records
    var cursor = db.collection('restaurants').find({"restaurant_id": "41704620"});  // Query top level fields
    //var cursor = db.collection('restaurants').find({"address.zipcode": "10075"});  // Query fields in an embedded document
    //var cursor = db.collection('restaurants').find( { "grades.grade": "B"} );   // Query fields in an array
    
    /* QUERIES USING OPERATORS */
    //var cursor = db.collection('restaurants').find( { "grades.score": { $gt: 30} });    // Greater Than $gt
    //var cursor = db.collection('restaurants').find( { "grades.score": { $lt: 10} });    // Less Than $lt
    
    /* QUERIES WITH MULTIPLE CONDITIONS */
    //var cursor = db.collection('restaurants').find( { "cuisine": "Italian", "address.zipcode": "10075" } ); // AND
    //var cursor = db.collection('restaurants').find( { $or: [ { "cuisine": "Italian" }, { "address.zipcode": "10075" } ] }); //OR
    
    /* SORTED QUERIES */
    //var cursor = db.collection('restaurants').find( ).sort( { "borough": 1, "address.zipcode": 1 } );   // Sort borough ascending and then zipcode ascending
    
    cursor.each(function(err, doc){
        assert.equal(err, null);
        if (doc != null){
            console.dir(doc);
        }else {
            callback();
        }
    });
};

var updateRestaurants = function(db, callback) {
    // Updates the first record
    // db.collection('restaurants').updateOne(
    //     { "name" : "Juni"},
    //     {
    //         $set: {"cuisine": "American (New)"},
    //         $currentDate: { "lastModified": true }
    //     }, function(err, results) {
    //         console.log(results);
    //         callback();
    //     }
    // );
    
    // Update an embedded field
    // db.collection('restaurants').updateOne(
    //     { "restaurant_id": "41156888" },
    //     { $set: { "address.street": "East 31st Street" } },
    //     function(err, results){
    //         console.log(results);
    //         callback();    
    //     }
    // );
    
    // Update many records
    // db.collection('restaurants').updateMany(
    //     { "address.zipcode": "10016", cuisine: "Other" },
    //     {
    //         $set: { cuisine: "Category To Be Determined" },
    //         $currentDate: { "lastModified": true }
    //     },
    //     function(err, results){
    //         console.log(results);
    //         callback();
    //     }
    // );
    
    // Replace a record
    // db.collection('restaurants').replaceOne(
    //     { "restaurant_id" : "41704620" },
    //     {
    //         "name" : "Vella 2",
    //         "address" : {
    //             "coord" : [ -73.9557413, 40.7720266 ],
    //             "building" : "1480",
    //             "street" : "2 Avenue",
    //             "zipcode" : "10075"
    //         }
    //     },
    //     function(err, results){
    //         console.log(results);
    //         callback();
    //     }
    // );
    
    // Append to an embedded array with $push
    db.collection('restaurants').updateOne(
        { "restaurant_id": "41704620"},
        {
            $push: { "Comments": {"comment": "Comment B"}}
        },
        function(err, results){
            console.log(results);
            callback();
        }
    );
};

// Connect to the database and performs actions before closing
// MongoClient.connect(url, function(err, db){
//     assert.equal(null, err);
//     console.log("Connected correctly to server.");
    
//     // insertDocument(db, function() {
//     //     db.close();
//     // })
    
//     // findRestaurants(db, function(){
//     //     db.close();
//     // });
    
//     // updateRestaurants(db, function(){
//     //     db.close();
//     // });
    
//     // updateRestaurants(db, function(){
//     // });
//     // findRestaurants(db, function(){
//     //     db.close();
//     // });
// });


