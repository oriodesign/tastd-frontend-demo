'use strict';

angular
    .module('services.event')
    .constant('TastdEvent', {
        // Restaurant
        'RESTAURANT_CREATE': 'restaurant:create',

        // User
        'USER_FOLLOW': 'user:follow',
        'USER_UNFOLLOW': 'user:unfollow',
        'USER_EDIT': 'user:edit',

        // Tutorial
        'TUTORIAL_COMPLETE': 'tutorial:complete',

        // On Boarding
        'ON_BOARDING_COMPLETE': 'on_boarding_complete',

        // Review
        'REVIEW_CREATE': 'review:create',
        'REVIEW_DELETE': 'review:delete',
        'REVIEW_EDIT': 'review:edit',

        // Wish
        'WISH_CREATE': 'wish:create',
        'WISH_EDIT': 'wish:edit',
        'WISH_DELETE': 'wish:delete',

        // Ranking
        'RANKING_REORDER': 'ranking:reorder'

    });
