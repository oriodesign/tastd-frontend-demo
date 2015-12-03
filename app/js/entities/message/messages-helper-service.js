'use strict';

angular
    .module('entities.message')
    .factory('MessageHelper', function MessageHelperFactory(Message) {

        var TITLE_ERROR_PREFIX = 'Error Rest. ID#';

        var rs = {};

        rs.sendMessage = function (msg) {
            return Message.$create(msg).$asPromise();
        };

        rs.sendRestaurantError = function (restId, error) {
            var msg = {
                title : TITLE_ERROR_PREFIX + restId,
                content : error,
                category : 'ERROR'
            };
            return Message.$create(msg).$asPromise();
        };

        return rs;
    });
