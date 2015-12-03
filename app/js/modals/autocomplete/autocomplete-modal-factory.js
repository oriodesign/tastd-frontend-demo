'use strict';

angular
    .module('modals.autocomplete')
    .factory('AutocompleteModal', function AutocompleteModalFactory(
        $rootScope,
        $q,
        $ionicModal,
        $ionicLoading,
        $log
    ) {

        var TEMPLATE_URL = 'js/modals/autocomplete/autocomplete-modal.html';

        return function autoCompleteModalFactory(options) {

            var d, modal;

            return {
                show : function (modalOptions) {

                    var opt = angular.extend({}, {
                        id: 'autocomplete-modal',
                        animation: 'slide-in-up',
                        focusFirstInput : true,
                        debounce : 1000,
                        $q : ''
                    }, options, modalOptions || {});

                    d = $q.defer();

                    if(!modal) {

                        modal = $ionicModal.fromTemplateUrl(TEMPLATE_URL, opt)
                            .then(function (m) {

                                var promise,
                                    modalScope = m.scope;

                                modalScope.$options = opt;
                                modalScope.$pending = false;
                                modalScope.$noResult = false;
                                modalScope.$results = opt.$results || [];

                                modalScope.$validate = function(item){
                                    opt.validator(item).then(function (item) {
                                        if (!item) {
                                            return;
                                        }
                                        m
                                            .remove()
                                            .then(function () {
                                                d.resolve(item);
                                            })
                                            .finally(function () {
                                                modal = null;
                                            });
                                    });
                                };

                                modalScope.$choose = function (item) {
                                    if (opt.validator) {
                                        return modalScope.$validate(item);
                                    }

                                    m.remove()
                                        .then(function () {
                                            d.resolve(item);
                                        })
                                        .finally(function () {
                                            modal = null;
                                        });
                                };

                                modalScope.$cancel = function () {

                                    m.remove().finally(function () {
                                        modal = null;
                                        d.reject('canceled');
                                    });
                                };

                                modalScope.$buttonCallback = function () {
                                    modalScope.$options.button.callback();
                                    m.remove().finally(function () {
                                        modal = null;
                                        d.resolve();
                                    });
                                };

                                modalScope.$loadMore = function () {
                                    modalScope.$results.$fetchMore().$asPromise().then(function() {
                                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                                    });
                                };



                                var searchAction = opt.search ? function (q) {
                                    modalScope.$pending = true;
                                    modalScope.$noResult = false;
                                    modalScope.$results.length = 0;

                                    promise = opt.search(q);

                                    promise.then(function (results) {
                                        modalScope.$results = results;
                                        if (!results.$hasPendingActions()) {
                                            modalScope.$noResult = results.length === 0;
                                            modalScope.$pending = false;
                                        }

                                        return results;
                                    });

                                    return promise;

                                } : angular.noop;

                                modalScope.$search = _.debounce(searchAction, 1000);

                                m.show();



                                modalScope.$watch('$options.$q', _.debounce(function (val) {
                                        modalScope.$apply(function () {
                                            modalScope.$q = val;
                                            modalScope.$search(val);
                                        });
                                }, 0));

                                $log.debug('modal show', modalScope.$options);
                            })
                            .catch(function (error) {
                                modal = null;
                                d.reject(error);
                            });
                    }else{
                        d.reject('already-open');
                    }

                    return d.promise;
                }
            };
        };

    });


/**
 * AutocompleteModal({
 *  id : 'search-something-modal',
 *  title: 'Search something...',
 *  scope: $scope,
 *  templateUrl: 'my-template.html'
 *  search : function (q) {
 *      return $searchService.search(q);
 *  }
 * })
 * .then(function (chosenResult) {
 *      $scope.chosenResult = chosenResult;
 * })
 * .catch(function (error) {
 *      window.alert(error.message);
 * });
 *
 * # my-template.html
 * <ion-item ng-hide="$results.length" translate="no.results"></ion-item>
 * <ion-item ng-repeat="location in $results track by location.id"
 *  ng-bind="location.name" ng-click="$choose(location)">
 * </ion-item>
 */
