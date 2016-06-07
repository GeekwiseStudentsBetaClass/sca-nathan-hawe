/* SUPER COOL APP API ROUTER */
var express = require('express');           
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',    // Replace MY_SECRET
    userProperty: 'payload'
});

var app = express();

var featureCtrl = require('../controllers/featureController');
var authenticationCtrl = require('../controllers/authenticationController');

// Features
router.post('/addFeature', featureCtrl.addFeature);
router.get('/getFeatures', featureCtrl.getFeatures);
router.post('/addComment', auth, featureCtrl.addComment);

// Votes
router.post('/addVote', auth, featureCtrl.addVote);

// Users
router.post('/register', authenticationCtrl.register);
router.post('/login', authenticationCtrl.login);

module.exports = router;