var mongoose = require('mongoose');
var crypto = require('crypto');         // Exposes some crypographic functions
var jwt = require('jsonwebtoken');      // JSON web tokens for managing authentication

// Define the user schema
var userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required:true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String,
        required: true,
    },
    zipcode: String,        // Weather API
    twitter: String,        // Twitter API
    hash: String,           
    salt: String
});

// Set a hash with a randomly generated salt value and using the Password
// Based Key Derivation Function 2.  This ensures that passwords are not
// stored in plain text and are difficult to reverse engineer.
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

// Comparing a hash of the passed pasword value with this document's salt against
// the document's hash will determine if the supplied password was correct.
userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    console.log(hash);
    console.log(this.hash);
    return hash == this.hash;
}

// Generate a JSON web token for an authenticated user.  Replace MY_SECRET with
// an environment variable on the server so that it is not publicly known.
userSchema.methods.generateJWT = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);   // Expiration date is seven days in the future

    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        name: this.name,
        zipcode: this.zipcode,
        twitter: this.twitter,
        exp: parseInt(expiry.getTime()/1000)
    }, "MY_SECRET");  // Replace MY_SECRET
}

// Compile the User schema with mongoose
mongoose.model('User', userSchema);