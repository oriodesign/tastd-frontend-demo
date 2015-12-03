'use strict';

angular
    .module('services.cache')
    .factory('Cache', function CacheFactory($http, Config, Security, $q) {

        return function (helper) {
            var items,
                collection = {};

            function refresh() {
                return $http.get(Config.apiUrl() + helper.url, {
                    params : {
                        user : Security.user.id
                    }
                }).then(function (resp) {
                    items = resp.data[helper.collectionName];
                    return items;
                });
            }


            // this function has to be called once before using the service
            function load() {
                if (items) {
                    var d = $q.defer();
                    return d.resolve(items);
                }
                return refresh();
            }

            function _getItem(id) {
                if (collection[id]) {
                    var d = $q.defer();
                    d.resolve(collection[id]);
                    return d.promise;
                }
                return helper.getItem(id);
            }

            function outOfSyncFallback(id, toBeAdded) {
                return function () {
                    return refresh().then(function () {
                        var found = get(id);
                        if (found !== toBeAdded) {
                            // TODO: show error
                        } else {
                            if (!toBeAdded) {
                                // when item is removed, its model is deleted
                                delete collection[id];
                            }
                        }
                    });
                };
            }

            function addModelToCollection(model) {
                var  id = helper.getId(model);
                collection[id] = model;

                return model;
            }

            // add and remove execute the operation remotely too
            function add(itemOrId, options) {
                var saveOrAdd, id;
                if (typeof itemOrId === 'object') {
                    id = helper.getId(itemOrId);
                    saveOrAdd = save(itemOrId);
                } else {
                    id = itemOrId.toString();
                    saveOrAdd = helper.create(id, options);
                    saveOrAdd.then(function(model){
                        helper.onAdd && helper.onAdd(id);
                        return model;
                    });
                }
                items.push(id);
                saveOrAdd
                    .then(addModelToCollection)
                    .catch(outOfSyncFallback(id, true));

                return saveOrAdd;
            }

            function save(model) {
                return model.$save().$asPromise();
            }

            function destroyAndUpdateCache(item) {
                var id = helper.getId(item);
                return item.$destroy().$then(function () {
                    items.splice(_.indexOf(items, id), 1);
                    delete collection[id];
                }, outOfSyncFallback(id, false))
                    .$asPromise();
            }

            function remove(itemOrId) {
                if (typeof itemOrId === 'object') {
                    return destroyAndUpdateCache(itemOrId);
                }
                var id = itemOrId.toString();
                return _getItem(id).then(
                    function(model){
                        if(model){
                        return destroyAndUpdateCache(model);
                        }
                        else{
                            return outOfSyncFallback(id, false)();
                        }
                    });
            }

            function get(itemId) {
                var id = itemId.toString();
                return _.indexOf(items, id) !== -1;
            }

            function getAll() {
                return items;
            }

            // just client side
            function addLocal(itemId) {
                var id = itemId.toString();
                if (_.indexOf(items, id) === -1) {
                    items.push(id);
                }
                return;
            }

            // just client side
            function removeLocal(itemId) {
                var id = itemId.toString();
                var i = _.indexOf(items, id);
                if (i !== -1) {
                    items.splice(i, 1);
                }
                return;
            }



            return {
                add : add,
                remove : remove,
                get : get,
                getAll : getAll,
                addLocal : addLocal,
                removeLocal : removeLocal,
                refresh : refresh,
                load : load
            };
        };

    });

