var mongoose = require('mongoose');

// Define the vote schema
var voteSchema = new mongoose.Schema({
    relatedUser: mongoose.Schema.Types.ObjectId,
    relatedFeature: mongoose.Schema.Types.ObjectId,
    isUpVote: Boolean,
    dateCreated: Date
});

// Compile the schema into a model with Mongoose
mongoose.model('Vote', voteSchema);