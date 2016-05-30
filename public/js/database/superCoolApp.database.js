/* 
    This file should implement a service for retrieving and holding data from API calls
    and two modules for features and comments.
*/
(function(){
    var myApp = angular.module('superCoolApp.database', []);
    
    /* database service */
    myApp.service('superCoolAppDatabaseService', ['$http', function($http){
        
        var me = this;
        
        this.data = {
            features: [],
            comments: []
        }
        
        this.selected = {}; // The current selected feature;
        
        var selectedIndex = -1; // The currently selected feature
        
        /* Define method to retrieve features */
        this.getFeatures = function(callback){
            console.log('attempting getFeatures')
            
            $http.get('api/getFeatures').success(function(data){
                
                // Set me.features to the returned data
                me.data.features = data;
                
                // If a callback exists, run it.
                if(!(callback === undefined)){
                    return callback();
                }
            });
        };
        
        
        /* Define method to retrieve comments for passed feature */
        this.getCommentsForFeature = function(featureIndex){
            console.log('attempting getComments for ' + featureIndex);

            // Prepare JSON object to be sent with callback
            if(!me.data.features[featureIndex]){
                console.log('No feature at index ' + me.selectedIndex);
                return;    
            }
            
            me.selected = me.data.features[featureIndex];
            
            var query = {
                relatedFeature:me.selected._id
            };
            
            $http.post('api/getComments', query).success(function(data){
                // Set me.comments to the returned data
                me.data.comments = data;
                console.log(data);
            });
        };
        
        /* Define method to add comments */
        this.addCommentForFeature = function(comment, callback){
            console.log('attempting addCommentForFeature ' + comment + ' ' + me.selected);
            
            // !!!!!!!Ensure that the comment has the required fields!!!!!!
            comment.relatedFeature = me.selected._id;
            
            // POST the comment
            $http.post('api/addComment', comment).success(function(data){
               console.log('api/addComment response: ' + data);
               
               // If a callback exists, run it
               if(!(callback===undefined)){
                   return callback();
               }
            });
        }
        
        
        // When created, get list of features and make the first feature selected
        this.getFeatures(function(){
            if(me.data.features[0]){
                console.log(me.data);
                // Insert code here to set the object to selected
                return me.getCommentsForFeature(0);
            }
            return;
        });
    }]);   
    
    
    /* Features Controller */
    myApp.controller('FeaturesController', ['superCoolAppDatabaseService', function(superCoolAppDatabaseService){
        // Bind data
        this.data = superCoolAppDatabaseService.data;
        
        this.selectFeature = function(featureId){
            superCoolAppDatabaseService.getCommentsForFeature(featureId);  
        };
    }]);
    
    
    /* Comments Controller */
    myApp.controller('CommentsController', ['superCoolAppDatabaseService', function(superCoolAppDatabaseService){
        var me = this;
        // Bind data
        this.data = superCoolAppDatabaseService.data
        this.comment = {};
        
        // Handle submissions
        this.submitComment = function(){
            return superCoolAppDatabaseService.addCommentForFeature(me.comment, function(){
                me.comment = {};
            });
        };
    }]);
})();