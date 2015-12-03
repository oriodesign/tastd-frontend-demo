'use strict';

angular
    .module('entities.restmod')
    .factory('EntityManager', function EntityManagerFactory(){
        return function EntityManager(entity) {

            // Methods to retrieve promises

            this.findAll = function (parameters) {
                return entity.$search(parameters).$asPromise();
            };

            this.findOneById = function (id) {
                return entity.$find(id).$asPromise();
            };

            this.save = function (resource) {
                return resource.$save().$asPromise();
            };

            // Methods to retrieve Restmod Resources and Collections

            this.findRestmodResource = function (id) {
                return entity.$find(id);
            };

            this.createRestmodResource = function (parameters) {
                return entity.$create(parameters);
            };

            this.buildRestmodResource = function (parameters) {
                return entity.$build(parameters);
            };

            this.searchRestmodCollection = function (parameters) {
                return entity.$search(parameters);
            };


        };
    });
