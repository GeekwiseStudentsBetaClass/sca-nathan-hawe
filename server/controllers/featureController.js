var mongoose = require('mongoose');
var Feature = mongoose.model('Feature');
var Vote = mongoose.model('Vote');

// Add a feature
module.exports.addFeature = function(req, res){
    console.log('addFeature is a stub.');
};

// Get all features
module.exports.getFeatures = function(req, res) {
    // This returns all features in the collection and
    // there are nothing required in the request.
    
    Feature
        .find({})
        .sort({totalVotes: -1})
        .exec(function(err, features){
            if(!err){
                res.status(200).json(features);
            }
            else {
                throw err;
            }
        });
};

// Add a comment to a feature
module.exports.addComment = function(req, res){
    console.log('addComment called')
    console.log(req.payload);
    console.log

    // Return an error if there is no user
    if(!req.payload._id){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add vote'
        });

        return;
    }

    // This requires a featureId to be passed in the request body.
    if(!req.body.relatedFeature){
        res.status(404).send('Missing required field');
        return;
    }    
    
    // Create a new feature and store the user, comment, and date in it
    var comment = {
        user: req.payload.username,
        commentText: req.body.commentText,
        dateCreated: new Date()
    };
    
    // Find the related feature and save the comment to its comments array
    console.log('Looking for feature ' + req.body.relatedFeature);
    Feature
        .findById(req.body.relatedFeature)
        .then(function(feature){
            // Save the comment to the embedded array
            feature.comments.push(comment);
            feature.save(function(){
                res.status(201).send("success");
            });
    });
}

// Add a vote
module.exports.addVote = function(req, res){
    console.log('addVote called')
    console.log(req.payload);
    console.log

    // Return an error if there is no user
    if(!req.payload._id){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add vote'
        });

        return;
    }

    // This requires a relatedFeature and isUpVote boolean in the request body
    if(!req.body.relatedFeature || req.body.isUpVote === undefined){
        res.status(404).send('Missing required field');
        return;
    }
    
    // Create the new Vote object
    var vote = new Vote;
    vote.relatedUser = req.payload._id;
    vote.relatedFeature = req.body.relatedFeature;
    vote.isUpVote = req.body.isUpVote;

    // Count the number of records for this feature and user
    Vote.count({relatedFeature: vote.relatedFeature, relatedUser: vote.relatedUser}, function(err, count){
        console.log(err);
        console.log(count);
        // The user can only vote once per feature
        if(count!=0){
            res.status(404).send('User has already voted');
            return;
        }

        //Find the related feature, add the vote, then add the vote to its own collection
        Feature
            .findById(req.body.relatedFeature)
            .then(function(feature){
                // Add the vote
                if(vote.isUpVote){
                    feature.upVote();
                }
                else{
                    feature.downVote();
                }
                return feature.save();
            })
            .then(function(){
                // Create the separate vote record in the Votes collection
                vote.save(function(err, response){
                    if(!err){
                        res.status(201).send("success");
                    }
                    else{
                        throw err;
                    } 
                });
            });
        });
}