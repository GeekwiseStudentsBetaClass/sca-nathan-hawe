var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Method for updating user values
module.exports.update = function(req, res){
    // Return an error if there is no user
    if(!req.payload._id){
        res.status(401).json({
            'message': 'UnauthorizedError: unable to add vote'
        });
        return;
    }

    // Retrieve the User object for the currently logged in person
    User
        .findById(req.payload._id)
        .then(function(user){
            // Check that a user was returned
            if(!user){
                res.status(400).json({
                    'message': 'Unable to locate user'
                });
                return;
            }

            // Update name, email, zip and twitter
            user.name = req.body.name;
            user.email = req.body.email;
            user.zipcode = req.body.zipcode;
            user.twitter = req.body.twitter;

            // Update password if not empty
            if(!req.body.password || req.body.password==""){
                // Leave password alone   
            } else{
                // Update pasword
                user.setPassword(req.body.password);
            }

            // Save user and return token.
            user.save(function(err) {
                if(!err){   // Success
                    var token;
                    token = user.generateJWT();
                    res.status(200);
                    res.json({
                        "token" : token
                    });
                } else{     // Failure
                    console.log(err);
                    res.status(400).json({
                        'message': err.name + ': ' + err.message
                    });
                    return;
                }
            });
        });
};