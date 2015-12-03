'use strict';

angular
    .module('entities.option')
    .factory('OptionManager', function UserManagerFactory (
        Option,
        EntityManager,
        $q,
        Security
    ) {
        var OPTION_DEFAULT_NAME = 'tastdapp',
            optionModel,
            option;

        return _.extend(new EntityManager(Option), {
            get : get,
            set : set
        });

        function set(name, content) {
            return _fetchOption().then(function () {
                option[name] = content;
                return _persist();
            });
        }

        function wrapOption(opt, name){
            var wrappingObj = {
                $save : function(){
                    return set(name, getNakedObj());
                },
                $destroy : function() {
                    return _fetchOption().then(function () {
                        delete option[name];
                        return _persist();
                    });
                }
            };

            var wrapped = angular.extend({}, opt[name], wrappingObj);

            function getNakedObj(){
                return _.omit(wrapped, _.keys(wrappingObj));
            }

            return wrapped;
        }

        function get(name) {
            return _fetchOption().then(function () {
                return wrapOption(option, name);
            });
        }

        function _persist() {
            optionModel.content = option;
            return optionModel.$save().$asPromise();
        }

        function _fetchOption() {
            if (option) {
                var d = $q.defer();
                d.resolve();
                return d.promise;
            }
            return Option.$search({
                user : Security.user.id
            }).$asPromise().then(function (opt) {
                optionModel = opt[0];
                if (optionModel) {
                    option = optionModel.content;
                } else {
                    optionModel = Option.$build();
                    optionModel.name = OPTION_DEFAULT_NAME;
                    option = {};
                }
            });
        }
    });
