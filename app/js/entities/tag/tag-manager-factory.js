'use strict';

angular
    .module('entities.tag')
    .factory('TagManager', function TagManagerFactory (
        Tag,
        EntityManager
    ) {
        return _.extend(new EntityManager(Tag), {
            BEST_FOR: 0,
            ATMOSPHERE: 1,
            LOCATION: 2,
            FOOD: 3,
            DRINKS: 4,
            SERVICES: 5,
            MENU: 6,
            OTHER: 7,
            VIBE: 8,
            ENTERTAINMENT: 9,
            SPECIAL_MENTION: 10
        });
    });
