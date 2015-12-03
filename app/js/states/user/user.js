'use strict';

angular
    .module('states.user', [
        'services.security'
    ])

    .config(function ($stateProvider) {

        $stateProvider.state('me', {
            url: '/me',
            parent: 'private',
            templateUrl: 'js/states/user/user.html',
            controller: 'UserCtrl as ctrl',
            layout: {
                'navbar-edit-button': true,
                'navbar-settings-button': true,
                'main-menu-profile': true
            }
        });

        $stateProvider.state('user', {
            url: '/user/:userId/show',
            parent:'private',
            templateUrl: 'js/states/user/user.html',
            controller: 'UserCtrl as ctrl',
            layout: {
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit',
                'navbar-back-button': true
            }
        });

        $stateProvider.state('userEdit', {
            url: '/user/edit',
            parent: 'private',
            templateUrl: 'js/states/user/user-edit.html',
            controller: 'UserEditCtrl as ctrl',
            title: 'user.edit_profile',
            layout: {
                'main-menu-profile': true,
                'navbar-back-button': true,
                'navbar-done-button': true
            }
        });

        $stateProvider.state('userFollowing', {
            url: '/user/:userId/following',
            parent:'private',
            templateUrl: 'js/states/user/user-follow-list.html',
            controller: 'UserFollowingCtrl as ctrl',
            title: 'user.following.page_title',
            layout: {
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit',
                'navbar-back-button': true
            }
        });

        $stateProvider.state('userFollowers', {
            url: '/user/:userId/followers',
            parent:'private',
            templateUrl: 'js/states/user/user-follow-list.html',
            controller: 'UserFollowersCtrl as ctrl',
            title: 'user.follower.page_title',
            layout: {
                'main-menu-news': 'inherit',
                'main-menu-restaurants': 'inherit',
                'main-menu-add': 'inherit',
                'main-menu-gurus': 'inherit',
                'main-menu-profile': 'inherit',
                'navbar-back-button': true
            }
        });

        $stateProvider.state('userSearch', {
            url: '/user/search/?geoname',
            parent:'private',
            title: 'user.add_gurus.page_title',
            templateUrl: 'js/states/user/user-search.html',
            controller: 'UserSearchCtrl as ctrl',
            layout: {
                'main-menu-gurus': true
            }
        });

        $stateProvider.state('user.passwordReset', {
            url : '/user/password-reset',
            parent : 'public',
            templateUrl : 'js/states/user/user-password-reset.html',
            controller : 'PasswordResetCtrl as ctrl',
            layout: {
                'main-menu-profile': true,
                'navbar-done-button': true,
                'navbar-back-button': true
            }
        });

        $stateProvider.state('user.passwordConfirm', {
            url : '/user/password-confirm?token',
            parent : 'public',
            templateUrl : 'js/states/user/user-password-confirm.html',
            controller : 'PasswordConfirmCtrl as ctrl',
            layout: {
                'main-menu-profile': true,
                'navbar-back-button': true
            }
        });

    });
