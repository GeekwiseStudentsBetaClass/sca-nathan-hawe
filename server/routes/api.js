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
var userController = require('../controllers/userController.js');
var voteCtrl = require('../controllers/voteController');

// Features
router.post('/addFeature', auth, featureCtrl.addFeature);
router.post('/removeFeature', auth, featureCtrl.removeFeature);
router.post('/updateFeature', auth, featureCtrl.updateFeature);
router.get('/getFeatures', featureCtrl.getFeatures);
router.post('/addComment', auth, featureCtrl.addComment);

// Votes
router.post('/addVote', auth, featureCtrl.addVote);
router.get('/getVotes', auth, voteCtrl.getVotes);

// Users
router.post('/register', authenticationCtrl.register);
router.post('/login', authenticationCtrl.login);
router.post('/updateUser', auth, userController.update);
router.post('/getUsers', auth, userController.getUsers);
router.post('/setAdmin', auth, userController.setAdmin);

module.exports = router;