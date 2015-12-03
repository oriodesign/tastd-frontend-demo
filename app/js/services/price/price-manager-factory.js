'use strict';

angular
    .module('services.price')
    .factory('PriceManager', function PriceManagerFactory(ForeignExchange) {
        var PriceManager = {
            convertAndRound: convertAndRound,
            convert: convert,
            getRangeLabel: getRangeLabel,
            getSliderLabel: getSliderLabel,
            maxPrice: 200,
            maxPriceNumber: 3
        };

        return PriceManager;

        function getSliderLabel (value, geoname) {
            var plus = value >= PriceManager.maxPrice ? ' +' : '';
            return convertAndRound(value, geoname) + getSymbolByGeoname(geoname) + plus;
        }

        function convert (value, geoname) {
            var rate = getRateByGeoname(geoname);
            return value * rate;
        }

        function convertAndRound(value, geoname) {
            return roundNumber(convert(value, geoname), geoname);
        }

        function roundNumber (value, geoname) {
            var exp = decimalToRound(geoname);
            var n = Math.pow(10, exp);
            return Math.round(value/n) * n;
        }

        function getRateByGeoname (geoname) {
            var currency = geoname.currencyCode ? geoname.currencyCode : 'USD';
            var rate = ForeignExchange.rates[currency];
            return rate ? rate : 1;
        }

        function getSymbolByGeoname (geoname) {
            return geoname.currencySymbol ? geoname.currencySymbol : '$';
        }

        function getRangeLabel (restaurant) {
            if (restaurant.averageCost) {
                var min = convertAndRound(restaurant.averageCost, restaurant.geoname);
                var interval = convertAndRound(10, restaurant.geoname);
                interval = interval < 10 ? 10 : interval;
                var max = min + interval;
                return min + '-' + max + getSymbolByGeoname(restaurant.geoname);
            }

            return 'N/A'
        }

        function decimalToRound(geoname) {
            var rate = getRateByGeoname(geoname);
            if (rate < PriceManager.maxPriceNumber) {
                return 1;
            } else if (rate < (PriceManager.maxPriceNumber * 10)) {
                return 2;
            } else if (rate < (PriceManager.maxPriceNumber * 100)) {
                return 3;
            } else if (rate < (PriceManager.maxPriceNumber * 1000)) {
                return 4;
            }

            return 5;
        }


    });

