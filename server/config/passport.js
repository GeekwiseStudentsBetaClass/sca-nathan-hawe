var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
    function(username, password, done){
        console.log('local strategy was used');
        User.findOne({ username: username}, function(err, user){
            console.log('Passport findOne');
            if (err) { return done(err); }  // There was an error
            if (!user) { return done(null, false); }    // No user document was returned
            if (!user.validPassword(password)) { return done(null, false); }    // The password hashes do not match
            return done(null, user);    // Success
        });
    }
));

console.log('config.js was loaded.')