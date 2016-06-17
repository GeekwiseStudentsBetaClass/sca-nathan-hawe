(function(){
    var myApp = angular.module('superCoolApp');

    myApp.controller('RegistrationController', ['$http', 'authentication', function($http, authentication){
        var self = this;
        this.isLoggedIn = authentication.isLoggedIn();  

        // Empty credentials object for new user
        this.credentials = {
            username: "",
            email: "",
            name: "",
            zipcode: "",
            twitter: "",
            password: ""
        }

        // Method to submit credentials for registration
        this.onSubmit = function(){
            authentication.register(self.credentials);
        }
    }]);
})();