'use strict';

angular
    .module('entities.expertise', [])
    .factory('ExpertiseManager', function ExpertiseManagerFactory (
        $http,
        Config
    ) {
        return {
            findAll: findAll
        };

        function findAll(userId, wish) {
            var params = {
                user: userId,
                groupBy: 'geoname'
            };
            if(wish){
                params.wish = wish;
            }
            return $http.get(Config.apiUrl()+'/expertise', {params: params})
                .then(function(resp) {
                    return resp.data.expertise;
                });
        }

    });
