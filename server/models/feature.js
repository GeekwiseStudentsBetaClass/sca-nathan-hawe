var mongoose = require('mongoose');

// Define a Comments schema for use as sub-document.
var Comments = new mongoose.Schema({
    user: String,
    commentText: String,
    dateCreated: Date
});

// Define feature schema
var featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    comments: [Comments],
    upVotes: Number,
    downVotes: Number,
    totalVotes: Number
})

// Process up votes
featureSchema.methods.upVote = function(){
    this.upVotes++;
    this.totalVotes = this.upVotes - this.downVotes;
}

// Process down votes
featureSchema.methods.downVote = function(){
    this.downVotes++;
    this.totalVotes = this.upVotes - this.downVotes;
}

// Compile the schema into a model with Mongoose
mongoose.model('Feature', featureSchema);