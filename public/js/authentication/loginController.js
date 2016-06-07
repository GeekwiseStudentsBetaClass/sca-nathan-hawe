(function(){
    var myApp = angular.module('superCoolApp');

    myApp.controller('LoginController', ['$http', 'authentication', function($http, authentication){
        var self = this;
        
        this.isLoggedIn = authentication.isLoggedIn();

        this.credentials = {
            username: "",
            password: ""
        };

        this.onSubmit = function(){
            authentication.login(self.credentials);
        }
    }]);

})();