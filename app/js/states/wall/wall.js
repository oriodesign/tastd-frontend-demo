'use strict';

angular
    .module('states.wall', [
        'entities.review'
    ])

    .config(function ($stateProvider) {

        $stateProvider.state('wall', {
            url: '/wall',
            parent: 'private',
            layout: {
                'main-menu-news': true,
                'navbar-notification-button': true
            },
            cache: false,
            title: 'wall.page_title',
            templateUrl: 'js/states/wall/wall.html',
            controller: 'WallCtrl as ctrl'
        });
    });
