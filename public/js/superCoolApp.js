(function(){
    var app = angular.module('superCoolApp', ['ui.router']);

    app.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('home');
        //$urlRouterProvider.when('/admin', '/admin/features');
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
            .state('admin.features', {
                url: '/features',
                templateUrl: 'views/admin.features.html',
                controller: 'AdminFeaturesController as adminFeaturesCtrl'
            })
            .state('admin.users', {
                url: '/users',
                templateUrl: 'views/admin.users.html',
                controller: 'AdminUsersController as adminUsersCtrl'
            })
    })
})();
