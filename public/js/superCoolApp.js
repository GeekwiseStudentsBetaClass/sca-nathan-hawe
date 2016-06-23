(function(){
    var app = angular.module('superCoolApp', ['ui.router']);

    app.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('home');
        $urlRouterProvider.when('/login', '/login/go');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
            })
            /* login child states */
            .state('login.go', {
                url: '/go',
                templateUrl: 'views/login.go.html',
                controller:  'LoginController as loginCtrl'
            })
            .state('login.register', {
                url: '/register',
                templateUrl: 'views/login.register.html',
                controller: 'RegistrationController as registrationCtrl'
            })
    })
})();
