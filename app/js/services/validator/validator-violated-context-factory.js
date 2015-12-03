'use strict';

angular
    .module('services.validator')
    .factory('ValidatorViolatedContext', function ValidatorViolatedContextFactory(
        ValidatorViolatedField,
        ValidatorViolationContext
    ) {

        return {
            getContextByForm: getContextByForm,
            getContextByRestResponse: getContextByRestResponse
        };

        function getContextByForm(formCtrl, options) {
            var context = new ValidatorViolationContext();
            angular.forEach(formCtrl.$error, function (violatedModelControllers, errorType) {
                angular.forEach(violatedModelControllers, function (violatedModelCtrl) {
                    context.addViolation(violatedModelCtrl.$name, errorType, options);
                });
            });

            return context;
        }

        function getContextByRestResponse(restResponse) {
            var context  = new ValidatorViolationContext();
            var response = restResponse.data ? restResponse : ( restResponse.$response || { data : {}});
            if(response.data.message) {
                context.setMainViolation(response.data.id, response.data.message, response.data.info);
            }
            angular.forEach(response.data.errors, function (errors, fieldName) {
                angular.forEach(errors, function (error) {
                    context.addViolation(fieldName, error);
                });
            });

            return context;
        }

    });
