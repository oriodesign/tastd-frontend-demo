'use strict';

angular
    .module('states.invite', [
        'services.contacts',
        'entities.invite',
        'entities.user'
    ])
    .config(function ($stateProvider) {
        $stateProvider.state('inviteHome', {
            url: '/invite/invite-home',
            parent: 'private',
            templateUrl: 'js/states/invite/invite-home.html',
            controller :'InviteHomeCtrl as ctrl',
            title: 'invite.page_title',
            layout: {
                'main-menu-profile': true,
                'navbar-back-button': true
            }

        });

    });
