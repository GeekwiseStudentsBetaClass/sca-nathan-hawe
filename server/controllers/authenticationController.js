var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Method for registering new users
module.exports.register = function(req, res){
    /* Add input validation */

    // Create a new User document with the values passed
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.name = req.body.name;
    user.zipcode = req.body.zipcode;
    user.twitter = req.body.twitter;

    // Generate the hash
    user.setPassword(req.body.password);

    // Save the new User into the collection
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
};

// Method for logging an existing user in
module.exports.login = function(req, res){
    
    passport.authenticate('local', function(err, user, info){
        var token;

        // catch errors
        if (err){
            console.log(err);
            res.status(400).json({
                'message': err.name + ': ' + err.message
            });
            return;
        }

        if(user){
            // User was found
            token = user.generateJWT();
            res.status(200);
            res.json({
                "token": token
            });
        }
        else{
            // User was not found
            res.status(401).json({
                'message': 'Username and/or password incorrect.'
            });
        }
    })(req, res);
};
