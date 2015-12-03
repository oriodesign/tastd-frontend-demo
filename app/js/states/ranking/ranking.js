'use strict';

angular
    .module('states.ranking', [
        'states.restaurant',
        'entities.user',
        'services.event'
    ])
    .config(function ($stateProvider) {



        $stateProvider.state('rankingReorder', {
            url: '/rankings/list/:cityId/cuisine/:cuisineId/edit',
            parent: 'private',
            templateUrl: 'js/states/ranking/ranking-reorder.html',
            controller: 'RankingReorderCtrl as ctrl',
            title: 'ranking.reorder.page_title',
            layout: {
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit',
                'navbar-back-button': true
            }
        });
    });
