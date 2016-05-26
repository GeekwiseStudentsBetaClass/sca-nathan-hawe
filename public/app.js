(function(){
    var app = angular.module('superCoolApp', []);
    
    app.controller('FeatureController', ['$http', '$interval', function($http, $interval){
        this.features = [];
        var featureList = this;
        
        // Make an API connection
        this.update = function(){
            $http.get('api/getFeatures').success(function(data){
                console.log('attempting getFeatures')
                featureList.features = data;
            });
        };
        
        this.update();
        $interval(this.update, 10000, this);
    }]);
    
    app.controller('AddFeatureController', ['$http', function($http){
        this.feature = {};
        var features = this;
        
        this.submitFeature = function(){
            $http.post('api/addFeature', features.feature).success(function(data){
                console.log(data);
                features.feature = {};
            });
        };
    }]);
    
    app.controller('CommentController', ['$http', '$interval', function($http, $interval){
        this.comments = {};
        var commentList = this;
        
        // Make an API call
        this.update = function(){
            $http.get('api/getComments').success(function(data){
                commentList.comments = data; 
            });
        };
        
        this.update();
        $interval(this.update, 10000, this);
    }]);
    app.controller('AddCommentController', ['$http', function($http){
        this.comment = {};
        var thisComment = this;
        
        this.submitComment = function(){
            $http.post('api/addComment', thisComment.comment).success(function(data){
               console.log(data);
               thisComment.comment = {}; 
            });
        }
    }]);

})();
