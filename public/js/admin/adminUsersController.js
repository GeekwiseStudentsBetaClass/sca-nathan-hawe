(function(){
    var myApp = angular.module('superCoolApp');
    
    myApp.controller('AdminUsersController', ['authentication', '$http', function(authentication, $http){
        var self = this;
        this.users = [];

        this.resetPassword = function(id){
            var request = {
                '_id': id,
                'password': 'ChangeMe'
            };

            $http({
                method: 'POST',
                url: '/api/resetPassword',
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                },
                data: request,
                })
                .then(
                    function(data){ // SUCCESS
                        console.log(data);
                        window.location.reload();
                    },
                    function(data){ // FAILURE
                        if(data.data.message){ alert(data.data.message); }
            });

        };

        this.removeAdmin = function(id){
            var request = {
                '_id': id,
            }
        };

        // Get list of users
        $http({
            method: 'POST',
            url: '/api/getUsers',
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            },
            })
            .then(
                function(data){ // SUCCESS
                    console.log(data);
                    self.users = data.data;
                },
                function(data){ // FAILURE
                    if(data.data.message){ alert(data.data.message); }
        });
    }]);
})();