'use strict';

angular
    .module('services.utility')
    // change 1.2.16 --> 1.3.13 brings incompatibilities:
    // https://github.com/angular/angular.js/compare/v1.2.16...v1.3.13#diff-1d54c5f722aebc473dbe96f836ddf974L945
    // so we need to use a custom filter
    .factory('JsonUtil', function JsonUtilFactory() {
        var JsonUtil = {
            toJson: toJson,
            toSimpleString: toSimpleString
        };

        return JsonUtil;

        function toJson (obj) {
                return JSON.stringify(obj, function (key, value) {
                    var val = value;
                    if (typeof key === 'string' && key.charAt(0) === '$') {
                        val = undefined;
                        // isWindow
                    } else if (value && value.document && value.location && value.alert && value.setInterval) {
                        val = '$WINDOW';
                    } else if (value && document === value) {
                        val = '$DOCUMENT';
                        // isScope
                    } else if (value && value.$evalAsync && value.$watch) {
                        val = '$SCOPE';
                    }
                    return val;
                }, 2);
        }

        function toSimpleString (obj) {
            var res = '{';
            if (isScalar(obj)) {
                res += ' ' + obj + ' ';
            } else {
                for (var name in obj) {
                    if (obj.hasOwnProperty(name)) {
                        if (isScalar(obj[name])) {
                            res += ( name + ':' + obj[name] + ', ');
                        }
                    }
                }
            }
            res += '}';
            return res;
        }

        function isScalar(obj){
            return (/string|number|boolean/).test(typeof obj);
        }

    });
