/* 
    This file should implement a service for retrieving and holding data from API calls
    and two modules for features and comments.
*/
(function(){
    var myApp = angular.module('superCoolApp');
    
    /* database service */
    myApp.service('superCoolAppDatabaseService', ['$http', '$interval', 'authentication', function($http, $interval, authentication){
        var me = this;
        var promise;
        
        this.data = {
            features: []
        }
        
        /* Define method to retrieve features */
        this.getFeatures = function(callback){
            
            $http.get('/api/getFeatures').then(
                function(data){ // SUCCESS
                    // Set me.features to the returned data
                    me.data.features = data;
                    
                    // Perform callback if there is any
                    if(typeof callback === "function"){
                        callback(data);
                    }
                },
                function(data){ // FAILURE
                    if(data.data.message){ alert(data.data.message); }
                }
            );
        };
        

        /* Define method to add comments */
        this.addCommentForFeature = function(comment, relatedFeature, callback){
            // !!!!!!!Ensure that the comment has the required fields!!!!!!
            comment.relatedFeature = relatedFeature;
            
            // POST the comment
            $http({
                method: 'POST',
                url: '/api/addComment',
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                },
                data: comment
                })
                .then(
                    function(data){ // SUCCESS
                        // If a callback exists, run it
                        if(!(callback===undefined)){
                            return callback();
                        }
                    },
                    function(data){ // FAILURE
                        if(data.data.message){ alert(data.data.message); }
                });
                           
        }
        
        /* Define method to add votes */
        this.addVoteForFeature = function(isUpVote, relatedFeature, callback){
            // !!!!!!!Ensure that the vote has the required fields!!!!!!
            var vote = {
                relatedFeature: relatedFeature,
                isUpVote: isUpVote
            };
            
            // POST the comment
            $http({
                    method: 'POST',
                    url: '/api/addVote',
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    },
                    data: vote
                })
                .then(
                    function(data){ //SUCCESS
                        // If a callback exists, run it
                        if(!(callback===undefined)){
                            return callback();
                        }
                    },
                    function(data){ // FAILURE
                        if(data.data.message){ alert(data.data.message); }
                    });
        }
        
        
        this.start = function(callback){
            this.getFeatures(callback);
            promise = $interval(me.getFeatures, 3000);
        };
        
    }]);   
    
    
    /* Features Controller */
    myApp.controller('FeaturesController', ['superCoolAppDatabaseService', 'authentication', function(superCoolAppDatabaseService, authentication){
        // Bind data
        var me = this;
        this.data = superCoolAppDatabaseService.data;
        this.comment = {};
        this.tab = 0;

        this.isLoggedIn = authentication.isLoggedIn();
        this.currentUser = authentication.currentUser();
        
        this.changeTab = function(input){
            me.tab = input;
        }
        
        // Handle submissions
        this.submitComment = function(feature){
            // Append comment to the comment array so that it appears before next update
            if(feature.comments === undefined){
                // There is no comments array yet
                feature.comments = [];
            }
            feature.comments.push(me.comment);
            
            // Store comment in database
            return superCoolAppDatabaseService.addCommentForFeature(me.comment, feature._id, function(){
                me.comment = {};
            });
        };
        
        // Handle upvotes
        this.addUpVote = function(feature){
            me.localVote(feature, true);
            return superCoolAppDatabaseService.addVoteForFeature(true, feature._id)
        };
        
        // Handle downvotes
        this.addDownVote = function(feature){
            me.localVote(feature, false);
            return superCoolAppDatabaseService.addVoteForFeature(false, feature._id)
        };
        
        this.localVote = function(feature, isUpVote){
                     
            // Ensure that upVotes, downVotes and totalVotes exists
            if(feature.upVotes === undefined){
                feature.upvotes = 0;
            }
            if(feature.downVotes === undefined){
                feature.downVotes = 0;
            }
            if(feature.totalVotes === undefined){
                feature.totalVotes = feature.upVotes - feature.downVotes;
            }
            
            // Process vote locally
            if(isUpVote){
                feature.upVotes++;
                feature.totalVotes++;
            }
            else{
                feature.downVotes++;
                feature.totalVotes--;
            }
        }
        
        
        // Start the service's interval and get the first returned data to set
        // the active panel
        superCoolAppDatabaseService.start(function(data){
            me.tab = data[0]._id;
        });
             
    }]);
    
})();