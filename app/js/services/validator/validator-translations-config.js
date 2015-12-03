'use strict';

angular
    .module('services.validator')
    .config(function ($translateProvider, VALIDATOR_VIOLATION_ERRORS_MESSAGES) {

        var translations = {}, MESSAGES = angular.copy(VALIDATOR_VIOLATION_ERRORS_MESSAGES);

        translations[MESSAGES.required]        = 'This value is required';
        translations[MESSAGES.minlength]       = 'This value is too short, must be at least {{ min }} characters long';
        translations[MESSAGES.maxlength]       = 'This value is too long, must be at most {{ max }} characters long';
        translations[MESSAGES.email]           = 'Please enter a valid email';
        translations[MESSAGES.confirmPassword] = 'Password should match';

        $translateProvider.translations('en', translations);
    });
