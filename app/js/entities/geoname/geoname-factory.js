'use strict';

angular
    .module('entities.geoname')
    .factory('Geoname', function GeonameFactory(restmod, Config) {
        var Geoname = restmod.model('/geonames').mix({
            $$type : 'Geoname',
            $config: {
                urlPrefix: Config.publicUrl()
            }
        });

        return Geoname;
    });
