/* SUPER COOL APP API ROUTER */
var express = require('express');           
var router = express.Router();

var app = express();

var featureCtrl = require('../controllers/featureController');

// Features
router.post('/addFeature', featureCtrl.addFeature);
router.get('/getFeatures', featureCtrl.getFeatures);
router.post('/addComment', featureCtrl.addComment);

// Votes
router.post('/addVote', featureCtrl.addVote);

module.exports = router;