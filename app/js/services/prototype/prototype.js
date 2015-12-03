'use strict';

angular
    .module('services.prototype', [])
    .run(function ($window) {
        // Douglas Crockford's Supplant
        if(!$window.String.prototype.supplant){
            $window.String.prototype.supplant = function(o){
                return this.replace(/\{([^{}]*)\}/g, function(a, b){
                    var r = o[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                });
            };
        }
    });
