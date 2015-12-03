'use strict';

angular.module('states.public', [
    'services.security',
    'services.analytics',
    'states.signin',
    'states.signup',
    'states.landing',
    'states.map'
])

.config(function ($stateProvider, SecurityProvider) {

    $stateProvider.state('public', {
        abstract: true,
        templateUrl: 'js/states/public/public.html',
        resolve : {
            me : SecurityProvider.resolvers.rememberMe
        }
    });
});
