'use strict';

angular
    .module('services.cache')
    .factory('MyLeadersHelper', function MyLeadersHelperFactory(
        Cache,
        User,
        Security,
        $http,
        UserManager
    ) {

        function add(id) {
            return UserManager.findRestmodResource(id).$then(function (user) {
                return user.followers.$create({
                    id : Security.user.id
                });
            }).$asPromise();
        }

        function getItem(id) {
            return UserManager.findRestmodResource(id).$asPromise().then(function (user) {

                return user.followers.$search({
                    id : Security.user.id
                }).$asPromise();
            });
        }


        var helper = {
            url : '/leaders/ids',
            collectionName : 'leaders',
            add : add,
            getItem : getItem
        };


        var cache = new Cache(helper);


        // overriding add and remove methods of cache

        cache.add = function (itemId) {
            var id = itemId.toString();
            return helper.add(id).then(function () {
                cache.addLocal(id);
            }).catch(function(){
                return cache.refresh().then(function () {
                    if (!cache.get(id)) {
                        // TODO: show error
                    }
                });
            });
        };

        cache.remove = function (itemId) {
            var id = itemId.toString();

            var resourceUrl = Security.user.leaders.$collection().$urlFor({}) + '/' + id;

            return $http.delete(resourceUrl).then(function() {
                cache.removeLocal(id);
            }).catch(function(){
                return cache.refresh().then(function(){
                    if(cache.get(id)){
                        // TODO: show error
                    }
                    else{
                        cache.removeLocal(id);
                    }
                });
            });
        };


        return cache;
    });
