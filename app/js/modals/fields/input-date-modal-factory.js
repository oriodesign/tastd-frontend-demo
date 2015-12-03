'use strict';

angular
    .module('modals.fields')
    .factory('InputDateModal', function InputDateModalFactory(
        $ionicModal,
        $q,
        $log,
        $rootScope
    ){
        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.done = done;
        modalScope.parameters = {};
        modalScope.parameters.text = '';
        modalScope.title = '';

        return {
            create: create
        };

        function create (defaultValue, title) {
            $log.debug('[INPUT_DATE_MODAL] Create');
            deferred = $q.defer();
            modalScope.title = title;
            modalScope.parameters.text = defaultValue ? defaultValue : '';
            createModal();

            return deferred.promise;
        }

        function createModal () {
            $log.debug('[INPUT_DATE_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/fields/input-date-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function done () {
            $log.debug('[INPUT_DATE_MODAL] Done');
            deferred.resolve(modalScope.parameters.text);
            ionicModal.hide().then(cleanUp);
        }

        function cancel () {
            $log.debug('[INPUT_DATE_MODAL] Cancel');
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[INPUT_DATE_MODAL] Clean up');
            modalScope.parameters.text = '';
            ionicModal.remove();
        }

    });
