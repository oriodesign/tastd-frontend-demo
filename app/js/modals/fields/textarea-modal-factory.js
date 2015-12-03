'use strict';

angular
    .module('modals.fields')
    .factory('TextareaModal', function TextareaModalFactory(
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
            $log.debug('[TEXTAREA_MODAL] Create');
            deferred = $q.defer();
            modalScope.title = title;
            modalScope.parameters.text = defaultValue ? defaultValue : '';
            createModal();

            return deferred.promise;
        }

        function createModal () {
            $log.debug('[TEXTAREA_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/fields/textarea-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function done () {
            $log.debug('[TEXTAREA_MODAL] Done');
            deferred.resolve(modalScope.parameters.text);
            ionicModal.hide().then(cleanUp);
        }

        function cancel () {
            $log.debug('[TEXTAREA_MODAL] Cancel');
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[TEXTAREA_MODAL] Clean up');
            modalScope.parameters.text = '';
            ionicModal.remove();
        }

    });
