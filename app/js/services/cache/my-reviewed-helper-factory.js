'use strict';

angular
    .module('services.cache')
    .factory('MyReviewedHelper', function MyReviewedHelperFactory(
        Cache,
        Review,
        Security,
        MyWishedHelper
    ) {

        function onAdd(id) {
            MyWishedHelper.removeLocal(id);
        }

        function create(id) {
            return Review.$create({
                restaurant : {
                    id : id
                }
            }).$asPromise();
        }

        function getId(item) {
            return item.restaurant.id.toString();
        }

        function getItem(id) {
            return Review.$search({
                restaurant : id,
                user : Security.user.id
            }).$asPromise().then(function (items) {
                return items[0];
            });
        }


        var helper = {
            url : '/restaurants/reviewed/ids',
            collectionName : 'restaurants',
            onAdd : onAdd,
            create : create,
            getId : getId,
            getItem : getItem
        };

        return new Cache(helper);
    });

