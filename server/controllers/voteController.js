var mongoose = require('mongoose');
var Vote = mongoose.model('Vote');

// Get votes for a user
module.exports.getVotes = function(req, res){
    // Return an error if there is no user
    if(!req.payload._id){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add vote'
        });
        return;
    }

    // Get the list of votes for the current user
    Vote
        .find({relatedUser: req.payload._id})
        .exec(function(err, votes){
            if(!err){
                res.status(200).json(votes);
            }
            else {
                console.log(err);
                res.status(400).json({
                    'message': err.name + ': ' + err.message
                });
            }
        });
}