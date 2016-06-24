var mongoose = require('mongoose');
var Feature = mongoose.model('Feature');
var Vote = mongoose.model('Vote');

// Add a feature
module.exports.addFeature = function(req, res){
    // Return an error if there is no user or user is not admin
    if(!req.payload._id || !req.payload.admin){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add feature'
        });

        return;
    }

    // Add feature
    var feature = new Feature();
    feature.name = req.body.name;
    feature.description = req.body.description;
    feature.upVotes = req.body.upVotes;
    feature.downVotes = req.body.downVotes;
    feature.totalVotes = req.body.upVotes - req.body.downVotes;
    feature.deleted = false;
    
    feature.save(function(err){
        if(!err){   // Success
            res.status(201).json({
                'message': 'success'
            });
        }else{     // Failure
            console.log(err);
            res.status(400).json({
                'message': err.name + ': ' + err.message
            });
            return;
        }
    });
};

// Update a feature
module.exports.updateFeature = function(req, res){
    // Return an error if there is no user or user is not admin
    if(!req.payload._id || !req.payload.admin){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add feature'
        });

        return;
    }

    // Get the requested feature
    Feature
        .findById(req.body._id)
        .then(function(feature){
            // update the returned feature's values
            feature.name = req.body.name;
            feature.description = req.body.description;
            feature.upVotes = req.body.upVotes;
            feature.downVotes = req.body.downVotes;
            feature.totalVotes = req.body.upVotes - req.body.downVotes;

            // save the updated feature
            feature.save(function(err){
                if(!err){   // Success
                    res.status(201).json({
                        'message': 'success'
                    });
                }else{     // Failure
                    console.log(err);
                    res.status(400).json({
                        'message': err.name + ': ' + err.message
                    });
                    return;
                }
            });
    });
};

// Remove a feature
module.exports.removeFeature = function(req, res){
    // Return an error if there is no user or user is not admin
    if(!req.payload._id || !req.payload.admin){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add feature'
        });

        return;
    }

    // Get the requested feature
    Feature
        .findById(req.body._id)
        .then(function(feature){
            // update the returned feature's deleted field
            feature.deleted = true;

            // save the updated feature
            feature.save(function(err){
                if(!err){   // Success
                    res.status(201).json({
                        'message': 'success'
                    });
                }else{     // Failure
                    console.log(err);
                    res.status(400).json({
                        'message': err.name + ': ' + err.message
                    });
                    return;
                }
            });
    });
}

// Get all features
module.exports.getFeatures = function(req, res) {
    // This returns all features in the collection and
    // there are nothing required in the request.
    
    Feature
        .find({deleted: {$ne:true}})
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
    // Return an error if there is no user
    if(!req.payload._id){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add vote'
        });

        return;
    }

    // This requires a featureId to be passed in the request body.
    if(!req.body.relatedFeature){
        res.status(404).json({
            'message': 'Missing required field'
        });
        return;
    }    
    
    // Create a new feature and store the user, comment, and date in it
    var comment = {
        user: req.payload.username,
        commentText: req.body.commentText,
        dateCreated: new Date()
    };
    
    // Find the related feature and save the comment to its comments array
    Feature
        .findById(req.body.relatedFeature)
        .then(function(feature){
            // Save the comment to the embedded array
            feature.comments.push(comment);
            feature.save(function(err){
                if(!err){   // Success
                    res.status(201).json({
                        'message': 'success'
                    });
                }else{     // Failure
                    console.log(err);
                    res.status(400).json({
                        'message': err.name + ': ' + err.message
                    });
                    return;
                }
            });
    });
}

// Add a vote
module.exports.addVote = function(req, res){

    // Return an error if there is no user
    if(!req.payload._id){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add vote'
        });
        return;
    }

    // This requires a relatedFeature and isUpVote boolean in the request body
    if(!req.body.relatedFeature || req.body.isUpVote === undefined){
        res.status(404).json({
            'message': 'Missing required field'
        });
        return;
    }
    
    // Create the new Vote object
    var vote = new Vote;
    vote.relatedUser = req.payload._id;
    vote.relatedFeature = req.body.relatedFeature;
    vote.isUpVote = req.body.isUpVote;

    // Count the number of records for this feature and user
    Vote.count({relatedFeature: vote.relatedFeature, relatedUser: vote.relatedUser}, function(err, count){
        // The user can only vote once per feature
        if(count!=0){
            res.status(404).json({
            'message': 'This user has already voted on this feature.'
        });
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
                        res.status(201).json({
                            'message': 'success'
                        });
                    } else {     // Failure
                        console.log(err);
                        res.status(400).json({
                            'message': err.name + ': ' + err.message
                        });
                        return;
                    }
                });
            });
        });
}