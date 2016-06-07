(function(){
    var myApp = angular.module('superCoolApp');

    myApp.controller('RegistrationController', ['$http', 'authentication', function($http, authentication){
        var self = this;
        this.isLoggedIn = authentication.isLoggedIn();

        this.credentials = {
            username: "",
            email: "",
            name: "",
            zipcode: "",
            twitter: "",
            password: ""
        }

        this.onSubmit = function(){
            authentication.register(self.credentials);
        }
    }]);
})();