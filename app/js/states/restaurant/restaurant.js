'use strict';

angular.module('states.restaurant', [
    'entities.restaurant',
    'entities.review',
    'services.event',
    'directives.tag',
    'entities.message',
    'services.storage',
    'services.utility'
    ])
    .config(function ($stateProvider) {

        $stateProvider.state('restaurantView', {
            url: '/restaurant/view/:restaurantId',
            parent: 'private',
            templateUrl: 'js/states/restaurant/restaurant-view.html',
            controller :'RestaurantViewCtrl as ctrl',
            layout: {
                'navbar-share-button': true,
                'navbar-back-button': true,
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit'
            }
        });

        $stateProvider.state('restaurantCreate', {
            url: '/restaurant/create?placeId&name',
            parent: 'private',
            templateUrl: 'js/states/restaurant/restaurant-create.html',
            controller :'RestaurantCreateCtrl as ctrl',
            title: 'restaurant.create.page_title',
            layout: {
                'navbar-back-button': true,
                'main-menu-add': true,
                'navbar-done-button': true
            }
        });

        $stateProvider.state('restaurantSearch', {
            url: '/restaurant/search',
            parent: 'private',
            templateUrl: 'js/states/restaurant/restaurant-search.html',
            controller :'RestaurantSearchCtrl as ctrl',
            title: 'restaurant.add_restaurant',
            layout: {
                'main-menu-add': true
            }
        });

        $stateProvider.state('restaurantSearchWeb', {
            url: '/restaurant/search-web?name',
            parent: 'private',
            templateUrl: 'js/states/restaurant/restaurant-search-web.html',
            controller :'RestaurantSearchWebCtrl as ctrl',
            title: 'restaurant.search_on_web.page_title',
            layout: {
                'main-menu-add': true,
                'navbar-back-button': true
            }
        });

        $stateProvider.state('restaurantError', {
            url: '/restaurant/reportError/:restaurantId',
            parent: 'private',
            templateUrl: 'js/states/restaurant/restaurant-error.html',
            controller :'NoticeErrorCtrl as ctrl',
            title: 'restaurant.report_an_error',
            layout: {
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit',
                'navbar-back-button': true
            }
        });

        $stateProvider.state('restaurantEdit', {
            url: '/restaurant/edit/:restaurantId',
            parent: 'private',
            templateUrl: 'js/states/restaurant/restaurant-edit.html',
            controller :'RestaurantEditCtrl as ctrl',
            title: 'restaurant.edit_restaurant',
            layout: {
                'navbar-back-button': true,
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit'
            }
        });

        $stateProvider.state('restaurantReviews', {
            url: '/restaurant/reviews/:restaurantId',
            parent: 'private',
            templateUrl: 'js/states/restaurant/reviews.html',
            controller :'ReviewsCtrl as ctrl',
            title: 'restaurant.gurus_review.page_title',
            layout: {
                'navbar-back-button': true,
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit'
            }
        });

    });

