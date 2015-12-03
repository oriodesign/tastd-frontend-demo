'use strict';

angular
    .module('entities.address')
    .factory('Address', function AddressFactory(restmod) {

        var Address = restmod.model('/addresses').mix({
            $$type: 'Address',
            geoname: {
                hasOne: 'Geoname'
            },
            $config: {
                name: 'address',
                plural: 'addresses'
            },
            $extend: {
                Record: {
                    getNameForRanking: function () {
                        return this.geoname.formattedName;
                    }
                }
            }
        });

        return Address;
    });
