(function(){
    var myApp = angular.module('superCoolApp');
    
    myApp.controller('AdminFeaturesController', ['superCoolAppDatabaseService', 'authentication', '$http', function(superCoolAppDatabaseService, authentication, $http){
        // Bind data
        var self = this;
        this.data = superCoolAppDatabaseService.data;
        this.tab = 0;
        this.newFeature = false;

        // default empty feature
        this.featureInformation = {
            _id: "",
            name: "",
            description: "",
            upVotes: 0,
            downVotes: 0,
            totalVotes: 0
        };

        // Method to change the currently displayed feature
        this.changeFeature = function(index){
            self.newFeature = false;
            self.featureInformation = self.data.features[index];
            self.tab = self.featureInformation._id;
        };

        // Method to setup page for adding a feature
        this.addFeature = function(){
            self.newFeature = true;
            self.tab = -1;
            self.featureInformation= {
                _id: "",
                name: "",
                description: "",
                upVotes: 0,
                downVotes: 0,
                totalVotes: 0
                };
        };

        // Method to update a feature
        this.update = function(){
            $http({
                method: 'POST',
                url: '/api/updateFeature',
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                },
                data: self.featureInformation
                })
                .then(
                    function(data){ // SUCCESS
                        window.location.reload();
                    },
                    function(data){ // FAILURE
                        if(data.data.message){ alert(data.data.message); }
                });
        };

        // Method to add a new feature
        this.add = function(){
            // Add to the local cache
            self.data.features.push(self.featureInformation);

            // Add feature to database
            $http({
                method: 'POST',
                url: '/api/addFeature',
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                },
                data: self.featureInformation
                })
                .then(
                    function(data){ // SUCCESS
                        
                    },
                    function(data){ // FAILURE
                        if(data.data.message){ alert(data.data.message); }
                });
        };

        // Method to remove a feature
        this.removeFeature = function(){
            if(confirm("Are you sure you want to remove " + self.featureInformation.name + "?")){
                $http({
                    method: 'POST',
                    url: '/api/removeFeature',
                    headers: {
                        Authorization: 'Bearer ' + authentication.getToken()
                    },
                    data: self.featureInformation
                    })
                    .then(
                        function(data){ // SUCCESS
                            window.location.reload();
                        },
                        function(data){ // FAILURE
                            if(data.data.message){ alert(data.data.message); }
                });
            }
        };
        
        // If the page is reloaded on Admin, restart the database service
        if(!superCoolAppDatabaseService.promise){
            superCoolAppDatabaseService.start(function(data){
                if(data.data.length > 0){
                    console.log('change')
                    self.changeFeature(0);
                }
            })
        }
        else{
            if(this.data.features.length>0){
                this.changeFeature(0);
            }
        }
        

    }]);
})();