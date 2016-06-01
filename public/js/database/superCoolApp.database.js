/* 
    This file should implement a service for retrieving and holding data from API calls
    and two modules for features and comments.
*/
(function(){
    var myApp = angular.module('superCoolApp.database', []);
    
    /* database service */
    myApp.service('superCoolAppDatabaseService', ['$http', function($http){
        // scope apply
        var me = this;
        
        this.data = {
            features: [],
            comments: []
        }
        
        this.selected = {}; // The currently selected feature;
        
        /* Define method to retrieve features */
        this.getFeatures = function(callback){
            console.log('attempting getFeatures')
            
            $http.get('api/getJoin').success(function(data){
                console.log(data);
                // Set me.features to the returned data
                me.data.features = data;
                
                // If a callback exists, run it.
                if(!(callback === undefined)){
                    return callback();
                }
            });
        };
        
        
        /* Define method to retrieve comments for passed feature */
        // this.getCommentsForFeature = function(featureIndex){
        //     console.log('attempting getComments for ' + featureIndex);

        //     // Prepare JSON object to be sent with callback
        //     if(!me.data.features[featureIndex]){
        //         console.log('No feature at index ' + me.selectedIndex);
        //         return;    
        //     }
            
        //     me.selected = me.data.features[featureIndex];
        //     console.log(me.selected);
            
        //     var query = {
        //         relatedFeature:me.selected._id
        //     };
            
        //     $http.post('api/getComments', query).success(function(data){
        //         // Set me.comments to the returned data
        //         me.data.comments = data;
        //         console.log(data);
        //     });
        // };
        
        /* Define method to add comments */
        this.addCommentForFeature = function(comment, relatedFeature, callback){
            console.log('attempting addCommentForFeature ' + comment + ' ' + me.selected);
            
            // !!!!!!!Ensure that the comment has the required fields!!!!!!
            comment.relatedFeature = relatedFeature;
            
            // POST the comment
            $http.post('api/addComment', comment).success(function(data){
               console.log('api/addComment response: ' + data);
               
               // If a callback exists, run it
               if(!(callback===undefined)){
                   return callback();
               }
            });
        }
        
        /* Define method to add votes */
        this.addVoteForFeature = function(isUpVote, relatedFeature, callback){
            console.log('attempting addVoteForFeature ' + isUpVote + ' ' + me.selected);
      
            // !!!!!!!Ensure that the vote has the required fields!!!!!!
            var vote = {
                relatedFeature: relatedFeature,
                isUpVote: isUpVote
            };
            
            // POST the comment
            $http.post('api/addVote', vote).success(function(data){
               console.log('api/addVote response: ' + data);
               
               // If a callback exists, run it
               if(!(callback===undefined)){
                   return callback();
               }
            });
        }
        
        
        //When created, get list of features and make the first feature selected
        this.getFeatures(function(){
           
            return;
        });
    }]);   
    
    
    /* Features Controller */
    myApp.controller('FeaturesController', ['superCoolAppDatabaseService', function(superCoolAppDatabaseService){
        // Bind data
        var me = this;
        this.data = superCoolAppDatabaseService.data;
        this.comment = {};
        this.tab = 0;
        
        this.test = function(input){
            me.tab = input;
        }
        
        // Handle submissions
        this.submitComment = function(relatedFeature){
            return superCoolAppDatabaseService.addCommentForFeature(me.comment, relatedFeature, function(){
                me.comment = {};
            });
        };
        
        // Handle upvotes
        this.addUpVote = function(relatedFeature){
            return superCoolAppDatabaseService.addVoteForFeature(true, relatedFeature)
        };
        
        // Handle downvotes
        this.addDownVote = function(relatedFeature){
            return superCoolAppDatabaseService.addVoteForFeature(false, relatedFeature)
        };
             
    }]);
    
    
    /* Comments Controller */
    // myApp.controller('CommentsController', ['superCoolAppDatabaseService', function(superCoolAppDatabaseService){
    //     var me = this;
    //     // Bind data
    //     this.data = superCoolAppDatabaseService.data;
    //     this.comment = {};
        
    //     // Handle submissions
    //     this.submitComment = function(){
    //         return superCoolAppDatabaseService.addCommentForFeature(me.comment, function(){
    //             me.comment = {};
    //         });
    //     };
    // }]);
    
})();