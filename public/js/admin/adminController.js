(function(){
    var myApp = angular.module('superCoolApp');
    
    myApp.controller('AdminController', ['authentication', function(authentication){
        this.currentState = "features";
    }]);
})();