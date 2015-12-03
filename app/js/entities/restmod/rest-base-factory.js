'use strict';

angular
    .module('entities.restmod')
    .factory('RestBase', function RestBaseFactory(
        restmod,
        inflector,
        $filter,
        $log
    ) {

        var RestBase = {
            created: {
                mask:'CU'
            }, // won't send this attribute on Create or Update
            updated: {
                mask:'CU'
            },
            $extend : {
                Record : {
                    isEqual : function (record) {
                        return this.$pk === record.$pk;
                    }
                },
                Collection : {
                    $orderBy : function (expression, reverse) {
                        var ordered  = $filter('orderBy')(this, expression, reverse || false);
                        // reset the collection contents:
                        this.length = 0;
                        this.push.apply(this, ordered);
                        return this;
                    },
                    $fetchMore : function (params) {
                        var extendedParams = angular.extend({}, params || {}, {
                            page : this.$metadata.nextPage
                        });
                        $log.debug('[REST_BASE] $fetchMore with params', params, extendedParams);
                        return this.$fetch(extendedParams);
                    }
                },
                Model: {
                    encodeUrlName: inflector.parameterize
                }
            }
        };

        return restmod.mixin('DefaultPacker', RestBase);
    });
