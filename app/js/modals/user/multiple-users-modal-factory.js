'use strict';

angular
    .module('modals.user', [])
    .factory('MultipleUsersModal', function MultipleUsersModalFactory(
        $ionicModal,
        UserManager,
        $q,
        $log,
        $rootScope
    ){
        var ionicModal = null;
        var deferred = null;
        var modalScope = $rootScope.$new();
        modalScope.cancel = cancel;
        modalScope.search = _.debounce(search, 300);
        modalScope.toggle = toggle;
        modalScope.loadMore = loadMore;
        modalScope.reset = reset;
        modalScope.done = done;
        modalScope.isSelected = isSelected;
        modalScope.users = [];
        modalScope.selectedFriends = [];
        modalScope.notUserId = null;

        return {
            create: create
        };

        function create (notUserId, selectedFriends) {
            $log.debug('[MULTIPLE_USERS_MODAL] Create', notUserId, selectedFriends);
            deferred = $q.defer();
            modalScope.users = [];

            modalScope.selectedFriends = selectedFriends ? selectedFriends : [];
            modalScope.notUserId = notUserId;

            modalScope.parameters = {
                name: ''
            };
            createModal();
            search();

            return deferred.promise;
        }

        function search () {
            $log.debug('[MULTIPLE_USERS_MODAL] Search start');
            modalScope.users.length = 0;
            modalScope.loading = true;
            var parameters = {};
            if (modalScope.parameters.name.trim() !== '' ) {
                parameters.query = modalScope.parameters.name
            }
            if (modalScope.notUserId) {
                parameters.notUsers = modalScope.notUserId;
            }

            UserManager.findAll(parameters).then(function (users) {
                $log.debug('[MULTIPLE_USERS_MODAL] Search end');
                modalScope.users = users;
                modalScope.loading = false;
            });
        }

        function createModal () {
            $log.debug('[MULTIPLE_USERS_MODAL] Create modal');
            $ionicModal.fromTemplateUrl('js/modals/user/multiple-users-modal.html', {
                scope: modalScope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                ionicModal = modal;
                modal.show();
            });
        }

        function done (user) {
            $log.debug('[MULTIPLE_USERS_MODAL] Done');
            deferred.resolve(modalScope.selectedFriends);
            ionicModal.hide().then(cleanUp);
        }

        function toggle (user) {
            $log.debug('[MULTIPLE_USERS_MODAL] Toggle');
            isSelected(user) ? remove(user) : add(user);
        }

        function add (user) {
            $log.debug('[MULTIPLE_USERS_MODAL] Add');
            modalScope.selectedFriends.push(user);
        }

        function remove (user) {
            $log.debug('[MULTIPLE_USERS_MODAL] Remove');
            modalScope.selectedFriends = _.reject(modalScope.selectedFriends, function(u){
                return u.id === user.id;
            });
        }

        function cancel () {
            $log.debug('[MULTIPLE_USERS_MODAL] Cancel');
            ionicModal.hide().then(cleanUp);
        }

        function cleanUp () {
            $log.debug('[MULTIPLE_USERS_MODAL] Clean up');
            modalScope.users = [];
            modalScope.selectedFriends = [];
            modalScope.parameters.name = '';
            ionicModal.remove();
        }

        function loadMore () {
            $log.debug('[MULTIPLE_USERS_MODAL] Load More');
            modalScope.users.$fetchMore().$asPromise().then(function () {
                modalScope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        function reset () {
            $log.debug('[MULTIPLE_USERS_MODAL] Reset');
            modalScope.selectedFriends = [];
            ionicModal.hide().then(cleanUp);
        }

        function isSelected (user) {
            return _.some(modalScope.selectedFriends, function(u){
                return user.id === u.id;
            });
        }

    });
