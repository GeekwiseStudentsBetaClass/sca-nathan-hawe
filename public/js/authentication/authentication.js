(function () {
    var myApp = angular.module('superCoolApp');

    // Service that handles user login functions
    myApp.service('authentication', ['$http', '$window', function($http, $window){
        var tokenKey = "sca-token";     // Key for storing/retrieving token from localStorage
        var self = this;
        
        // Method for saving tokens returned in a successful login/registration to localStorage
        this.saveToken = function(token){
            $window.localStorage[tokenKey] = token;
        };
        
        // Method for retrieving a token previously saved in localStorage
        this.getToken = function(){
            return $window.localStorage[tokenKey];
        }

        // Method for logging out by removing the cached token in localStorage
        this.logout = function(){
            $window.localStorage.removeItem(tokenKey);
            window.location.reload();   // Reload the current page
        }

        // Method for determining if the cached token is still valid (still logged in)
        this.isLoggedIn = function(){
            var token = self.getToken();
            var payload;

            // If the token exists, make sure the expiry date is valid
            if(token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            }else{
                // There was no token, therefore user is not logged in
                return false;
            }
        }

        // Method for extracting information from the cached token
        this.currentUser = function(){
            if(self.isLoggedIn()){
                var token = self.getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return {
                    username: payload.username,
                    email: payload.email,
                    name: payload.name,
                    zipcode: payload.zipcode,
                    twitter: payload.twitter
                };
            }
        };

        // Method for registering a new user
        this.register = function(user){
            return $http.post('/api/register', user).then(
                function(data){ // Success
                    console.log(data);
                    self.saveToken(data.data.token);
                    window.location = "/"
                },
                function(data){ // Failure
                    if(data.data.message){ alert(data.data.message); }
                }
            )
        };

        // Method for logging user in
        this.login = function(user){
            return $http.post('/api/login', user).then(
                function(data){ // Success
                    self.saveToken(data.data.token);    // Cache the token
                   window.location = "/"           // Reload window
                },
                function(data){ // Failure
                    if(data.data.message){ alert(data.data.message); }
                    
                }
            )
        };
    }]);

})();