'use strict';

angular
    .module('services.cache')
    .factory('MyWishedHelper', function MyWishedHelperFactory(Cache, Wish, Security) {

        function create(id, opt) {
            return Wish.$create(angular.extend({
                restaurant : {
                    id : id
                }
            }, (opt || {})))
                .$asPromise();
        }

        function getId(item) {
            return item.restaurant.id.toString();
        }

        function getItem(id) {
            return Wish.$search({
                restaurant : id,
                user : Security.user.id
            }).$asPromise().then(function (items) {
                return items[0];
            });
        }


        var helper = {
            url : '/restaurants/wished/ids',
            collectionName : 'restaurants',
            create : create,
            getId : getId,
            getItem : getItem
        };

        return new Cache(helper);
    });

