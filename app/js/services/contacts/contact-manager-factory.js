'use strict';

angular
    .module('services.contacts')
    .factory('ContactManager', function ContactManagerFactory(
        $q,
        $cordovaContacts,
        $window,
        $log
    ) {

        return {
            findAll: findAll,
            findUniqueEmails: findUniqueEmails
        };

        function findAll() {
            $log.debug('[CONTACT_MANAGER] Find all');
            var promise;
            if (window.cordova) {
                promise = $cordovaContacts.find({filter: '', multiple: true});
                return promise.then(unwrapNestedEmails);
            }

            var deferred = $q.defer();
            var contacts = getFakeContacts();
            deferred.resolve(contacts);
            promise = deferred.promise;
            return promise.then(unwrapNestedEmails);
        }

        function unwrapNestedEmails(contacts) {
            $log.debug('[CONTACT_MANAGER] Unwrap nested emails');
            var emails = [];
            angular.forEach(contacts, function(c) {
                angular.forEach(c.emails, function(e) {
                    var item = {
                        name: c.name.formatted,
                        familyName: c.name.familyName,
                        email: e.value
                    };
                    emails.push(item);
                });
            });
            return emails;
        }

        function findUniqueEmails () {
            var deferred = $q.defer();
            findAll().then(function(contacts){
                var results = [];
                _.each(contacts, function(contact){
                    results.push(contact.email);
                });
                results = _.uniq(results);
                deferred.resolve(results);
            });
            return deferred.promise;
        }

        function getFakeContacts() {
            return [
                {name: {formatted: '', familyName: ''}, emails: [{value: 'n@n.com'}, {value: 'john@gmail.com'}]},
                {name: {formatted: 'Dragon Ball', familyName: 'Ball'}, emails: [{value: 'dragon1@ball.com'}, {value: 'jack@gmail.com'}]},
                {name: {formatted: 'Mr Smith', familyName: 'Smith'}},
                {name: {formatted: 'Mr Smith', familyName: 'Smith'}, emails: [{value: 'mrsmith@gmail.com'}]},
                {name: {formatted: 'User 1', familyName: 'Smith'}, emails: [{value: 'user@mail.com'}]},
                {name: {formatted: 'User 2', familyName: 'Smith'}, emails: [{value: 'user2@mail.com'}]},
                {name: {formatted: 'User 3', familyName: 'Smith'}, emails: [{value: 'user3@mail.com'}]},
                {name: {formatted: 'Jacopo', familyName: 'Ghidoni'}, emails: [{value: 'jacopo@tastdapp.com'}]},
                {name: {formatted: 'Duplicated', familyName: 'Jappo'}, emails: [{value: 'jacopo@tastdapp.com'}]},
                {name: {formatted: 'Matteo', familyName: 'Orioli'}, emails: [{value: 'oriodesign@gmail.com'}]},
                {name: {formatted: 'Hello world'}, emails: [{value: 'hello@world.com'}]},
                {name: {formatted: 'Hello world 2'}, emails: [{value: 'hello@world.com'}]},
                {name: {formatted: 'Est7'}, emails: [{value: 'est.zanon@gmail.com'}]},
                {name: {formatted: 'Pedro'}, emails: [{value: 'and.pedroni@gmail.com'}]}
            ];
        }

    });
