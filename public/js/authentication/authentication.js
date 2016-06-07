(function () {
    var myApp = angular.module('superCoolApp');

    myApp.service('authentication', ['$http', '$window', function($http, $window){
        var self = this;

        this.saveToken = function(token){
            console.log('Saving token: ');
            console.log(token);
            $window.localStorage['sca-token'] = token;
        };
        
        this.getToken = function(){
            return $window.localStorage['sca-token'];
        }

        this.logout = function(){
            $window.localStorage.removeItem('sca-token');
            window.location.reload();
        }

        this.isLoggedIn = function(){
            var token = self.getToken();
            var payload;
            console.log(token);

            if(token){
                payload = token.split('.')[1];
                console.log(payload);
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            }else{
                return false;
            }
        }

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

        this.register = function(user){
            return $http.post('api/register', user).then(
                function(data){ // Success
                    console.log(data);
                    self.saveToken(data.data.token);
                    window.location.reload();
                },
                function(data){ // Failure
                    if(data.statusText){ alert('Error: ' + data.statusText); }
                }
            )
        };

        this.login = function(user){
            return $http.post('api/login', user).then(
                function(data){ // Success
                    console.log(data);
                    self.saveToken(data.data.token);
                    window.location.reload();    
                },
                function(data){ // Failure
                    if(data.statusText){ alert('Error: ' + data.statusText); }
                    
                }
            )
        };
    }]);

})();