'use strict';

// Tastd App
angular
    .module(AppHelper.APP_NAME)

    .factory('RestError', function RestErrorFactory(
        $log
    ) {

        var HTTP_STATUS = {
            NOT_AUTHENTICATED : 401
        };

        return {
            fromResponse : function (response) {
                response = response || {};

                // Is it a restmod model?
                var r = response.$response ? response.$response : response;
                $log.debug('[REST_ERROR] From response', r);
                var data = r ? r.data : {};

                return angular.extend({},{
                    _$response : r,
                    $title : 'Whoops...',
                    $isAuthError : function () {
                        return ( this.code + '' ) === ( HTTP_STATUS.NOT_AUTHENTICATED + '' ) &&
                            ( this.category === 'Auth' );
                    }
                }, data || {});
            }
        };
    });
