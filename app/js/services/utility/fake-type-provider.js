'use strict';

angular
    .module('services.utility')
    .provider('FakeType', function FakeTypeProvider() {
        var defaultProviderOptions = {
            property : '$$type'
        },
        providerOptions = angular.copy(defaultProviderOptions);

        this.options = function () {
            if(arguments[0]) {
                angular.extend(providerOptions, arguments[0]);
                return this;
            }else{
                return providerOptions;
            }
        };

        this.$get = function () {

            var service = {
                $$errors : {
                    FakeTypeUnsupportedObjectError : FakeTypeUnsupportedObjectError,
                    FakeTypeIsFunctionButValueIsUnsupportedError :  FakeTypeIsFunctionButValueIsUnsupportedError
                },
                $$property : function () {
                    return providerOptions.property;
                },
                $$get : function(object) {
                    return object[service.$$property()];
                },
                /**
                 * Check if object supports fake type checking
                 *
                 * @param object
                 * @returns {boolean}
                 */
                supports : function (object) {
                    var type = service.$$get(object);
                    return _.isString(type) || _.isFunction(type);
                },
                /**
                 * Get the object "fake type"
                 *
                 * @param object
                 * @returns {string}
                 * @throws Error
                 */
                'get' : function (object) {

                    if(!service.supports(object)) {
                        throw new FakeTypeUnsupportedObjectError(service.$$property());
                    }

                    var property = service.$$get(object);

                    if(_.isString(property)) {
                        return property;
                    }

                    if(_.isFunction(service.$$get(object))) {
                        property = property();

                        if(!_.isString(property)) {
                            throw new FakeTypeIsFunctionButValueIsUnsupportedError();
                        }
                        return property;
                    }

                    throw new Error('Unexpected error');
                },
                /**
                 * Check if object is fake type
                 *
                 * @param {object} object
                 * @param {string|object} FakeType
                 */
                check : function (object, FakeType) {
                    if(_.isString(FakeType)) {
                        return service.get(object) === FakeType;
                    }
                    return service.get(object) === service.get(FakeType);
                }
            };

            return service;
        };

        /**
         * Experimental named errors
         */

        /**
         * FakeTypeUnsupportedObjectError
         * @inherits Error
         * @param property
         * @constructor
         */
        function FakeTypeUnsupportedObjectError(property) {
            this.name = 'FakeTypeUnsupportedObjectError';
            this.message = 'Object is not supported, property "' + property + '" not found, you must add $$type property to your Object!';
        }
        FakeTypeUnsupportedObjectError.prototype = new Error();
        FakeTypeUnsupportedObjectError.prototype.constructor = FakeTypeUnsupportedObjectError;

        /**
         * FakeTypeUnsupportedObjectError
         * @inherits Error
         * @param {string}[message]
         * @constructor
         */
        function FakeTypeIsFunctionButValueIsUnsupportedError(message) {
            this.name = 'FakeTypeIsFunctionButValueIsUnsupportedError';
            this.message = message || 'Property is a function but returned value is not a string as expected';
        }
        FakeTypeIsFunctionButValueIsUnsupportedError.prototype = new Error();
        FakeTypeIsFunctionButValueIsUnsupportedError.prototype.constructor = FakeTypeIsFunctionButValueIsUnsupportedError;



        return this;
    });
