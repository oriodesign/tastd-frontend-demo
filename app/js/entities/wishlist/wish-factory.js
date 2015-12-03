'use strict';

angular
    .module('entities.wishlist')
    .factory('Wish', function WishFactory(restmod) {
        var Wish = restmod.model('/wishes').mix({
            $$type : 'Wish'
        });

        return Wish;
    });
