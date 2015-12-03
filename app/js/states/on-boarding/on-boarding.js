'use strict';

angular
    .module('states.onBoarding', [
        'directives.map',
        'services.event'
    ])
    .config(function ($stateProvider, SecurityProvider) {

        $stateProvider.state('onBoardingIntro', {
            url : '/on-boarding/intro',
            templateUrl : 'js/states/on-boarding/on-boarding-intro.html',
            controller : 'OnBoardingIntroCtrl as ctrl',
            resolve :  {
                me: SecurityProvider.resolvers.me
            }
        });

        $stateProvider.state('onBoardingTopRestaurants', {
            url : '/on-boarding/top-restaurants',
            parent : 'private',
            templateUrl : 'js/states/on-boarding/on-boarding-top-restaurants.html',
            controller : 'OnBoardingTopRestaurantsCtrl as ctrl',
            title: 'on_boarding.top_restaurants.page_title',
            layout: {
                'main-menu': false
            }
        });

        $stateProvider.state('onBoardingFriends', {
            url : '/on-boarding/friends',
            parent : 'private',
            templateUrl : 'js/states/on-boarding/on-boarding-friends.html',
            controller : 'OnBoardingFriendsCtrl as ctrl',
            title: 'on_boarding.friends.page_title',
            layout: {
                'main-menu': false
            }
        });

        $stateProvider.state('onBoardingTopGurus', {
            url : '/on-boarding/top-gurus',
            parent : 'private',
            templateUrl : 'js/states/on-boarding/on-boarding-top-gurus.html',
            controller : 'OnBoardingTopGurusCtrl as ctrl',
            title: 'on_boarding.top_gurus.page_title',
            layout: {
                'main-menu': false
            }
        });

        $stateProvider.state('onBoardingSuggestions', {
            url : '/on-boarding/suggestions',
            templateUrl : 'js/states/on-boarding/on-boarding-suggestions.html',
            controller : 'OnBoardingSuggestionsCtrl as ctrl',
            parent : 'private',
            title: 'on_boarding.suggestions.page_title',
            layout: {
                'main-menu': false
            }
        });

    });
