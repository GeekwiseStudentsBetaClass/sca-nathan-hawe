(function(){
    var app = angular.module('superCoolApp', ['ui.router']);

    app.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('home');
        
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller:  'LoginController as loginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register.html',
                controller: 'RegistrationController as registrationCtrl'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'views/settings.html',
                controller: 'SettingsController as settingsCtrl'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'views/admin.html',
                controller: 'AdminController as adminCtrl'
            })
    })
})();
