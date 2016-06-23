(function(){
    var myApp = angular.module('superCoolApp');

    myApp.controller('SettingsController', ['$http', 'authentication', function($http, authentication){
        var self = this;
        this.isLoggedIn = authentication.isLoggedIn();
        var currentUser = authentication.currentUser();  

        // Settings object that shows the currentUser data
        this.settings = {
            username: currentUser.username,
            email: currentUser.email,
            name: currentUser.name,
            zipcode: currentUser.zipcode,
            twitter: currentUser.twitter,
            password: ""
        }

        // Method to submit settings for update
        this.onSubmit = function(){
            authentication.updateUser(self.settings);
        }
    }]);
})();