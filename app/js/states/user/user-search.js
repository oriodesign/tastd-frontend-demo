'use strict';

angular
    .module('states.user')
    .controller('UserSearchCtrl', function (
        $scope,
        $ionicLoading,
        $timeout,
        GeonameManager,
        $stateParams,
        $translate,
        $state,
        GeonameModal,
        UserManager,
        $log,
        ContactManager,
        MD5Util,
        FacebookConnect,
        FriendManager,
        ValidatorViolatedContext,
        IonicValidateOnSubmitPopup,
        $q,
        AlertPopup,
        $cordovaSocialSharing,
        me,
        Analytics,
        $ionicScrollDelegate
    ) {
        var ctrl = this;
        var podium = [];
        ctrl.$state = $state;
        ctrl.searchCriteria = {
            query : null,
            notUsers: null,
            geoname : null
        };
        ctrl.isPodium = isPodium;
        ctrl.user = me;
        ctrl.users = [];
        ctrl.loading = false;
        ctrl.emailsLength = 0;
        ctrl.chunksLength = 0;
        ctrl.loadedChunks = 0;

        ctrl.loadMore = loadMore;
        ctrl.changeGeoname = changeGeoname;
        ctrl.enableGeoFilter = enableGeoFilter;
        ctrl.disableGeoFilter = disableGeoFilter;
        ctrl.cancel = cancel;
        ctrl.search = _.debounce(searchUsers, 200);
        ctrl.searchContacts = searchContacts;
        ctrl.searchFriends = searchFriends;
        ctrl.getProgress = getProgress;
        ctrl.publishOnFb = publishOnFb;

        initialize();

        function initialize () {
            $log.debug('[CONTROLLER] Initialize');
            if ($stateParams.geoname) {
                GeonameManager.findOneById($stateParams.geoname)
                    .then(function (geoname) {
                        $log.debug('[CONTROLLER] On geoname find');
                        ctrl.searchCriteria.geoname = geoname;
                        searchUsers();
                    });
            } else {
                searchUsers();
            }
        }

        function searchUsers () {
            $log.debug('[CONTROLLER] Search users');
            ctrl.loading = true;
            ctrl.isFacebookSearch = false;
            ctrl.isTastdSearch = true;
            ctrl.isContactsSearch = false;
            ctrl.users = [];
            $ionicScrollDelegate.scrollTop();
            UserManager.findAll(getSearchParameters())
                .then(function(users){
                    ctrl.loading = false;
                    ctrl.users = users;
                    refreshPodium();
                });
        }

        function refreshPodium () {
            $log.debug('[CONTROLLER] Refresh podium');
            if (ctrl.users.length < 3) {
                return resetPodium();
            }
            if(!ctrl.searchCriteria.query || !ctrl.searchCriteria.query.length){
                podium[0] = ctrl.users[0].id;
                podium[1] = ctrl.users[1].id;
                podium[2] = ctrl.users[2].id;
            }
        }

        function resetPodium () {
            podium.length = 0;
        }

        function cancel () {
            ctrl.searchCriteria.query = null;
        }

        function disableGeoFilter () {
            ctrl.searchCriteria.geoname = null;
            ctrl.searchCriteria.query = null;
            ctrl.search();
        }

        function enableGeoFilter (geoname) {
            ctrl.searchCriteria.geoname = geoname;
            ctrl.searchCriteria.query = null;
            ctrl.search();
        }

        function changeGeoname () {
            GeonameModal.createWithAllCities()
                .then(function(geoname) {
                    $log.debug('[CONTROLLER] Geoname modal result', geoname);
                    geoname === 'all' ? disableGeoFilter() : enableGeoFilter(geoname);
                });
        }

        function loadMore () {
            return ctrl.users.$fetchMore().$asPromise()
                .finally(function (data) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return data;
                });
        }

        function getSearchParameters () {
            if (ctrl.searchCriteria.query==='') {
                ctrl.searchCriteria.query = null;
            }
            if (ctrl.searchCriteria.geoname) {
                ctrl.searchCriteria.orderBy = 'geoScore';
                return _.extend(_.omit(ctrl.searchCriteria, 'geoname'), {
                    geoname: ctrl.searchCriteria.geoname.id,
                    orderBy: 'geoScore',
                    notUsers: me.id
                });
            } else {
                ctrl.searchCriteria.orderBy = 'score';
                ctrl.searchCriteria.notUsers = me.id;
                return ctrl.searchCriteria;
            }

        }

        function isPodium (user) {
            return _.contains(podium, user.id);
        }

        // CONTACTS

        function searchContacts () {
            Analytics.trackView('userSearchFromContacts');
            // Ios trigger two times searchContacts!
            if (ctrl.isContactsSearch) {
                return;
            }
            ctrl.isFacebookSearch = false;
            ctrl.isTastdSearch = false;
            ctrl.isContactsSearch = true;
            ctrl.loadedChunks = 0;
            ctrl.users = [];
            $ionicScrollDelegate.scrollTop();
            ctrl.loading = true;
            ctrl.searchCriteria.geoname = null;
            ContactManager.findUniqueEmails().then(function(contacts) {
                ctrl.emailsLength = contacts.length;
                var contactsChunks = chunkArray(contacts);
                ctrl.chunksLength = contactsChunks.length;
                _.each(contactsChunks, loadContacts);
            }, function() {
                ctrl.loading = false;
                AlertPopup.create(
                    'popup.contacts_not_available.title',
                    'popup.contacts_not_available.text'
                );
            });
        }

        function getProgress() {
            if (!ctrl.chunksLength || ctrl.chunksLength === 0) {
                return 0;
            }
            var result = parseInt((ctrl.loadedChunks / ctrl.chunksLength) * 100)
            result = result > 100 ? 100 : result;

            return result;
        }

        function loadContacts (contacts) {
            $log.debug('[CONTROLLER] Load chunk', contacts);
            ctrl.loading = true;
            return UserManager.findAll({
                emails: buildQueryString(contacts),
                notUsers: me.id
            }).then(function(users){
                $log.debug('[CONTROLLER] On Load chunk', users);
                ctrl.loadedChunks++;
                appendResults(users);
                sortUsersByAlphabetically();
                if (ctrl.loadedChunks === ctrl.chunksLength) {
                    ctrl.loading = false;
                }
            });
        }

        function chunkArray (contacts) {
            var i,j,temporaryArray,chunk = 20,results=[];
            for (i=0,j=contacts.length; i<j; i+=chunk) {
                temporaryArray = contacts.slice(i,i+chunk);
                results.push(temporaryArray);
            }
            return results;
        }

        function buildQueryString (contacts) {
            return _(contacts).map(function(c) {
                return MD5Util.md5(c);
            }).value().join(',');
        }

        function sortUsersByAlphabetically() {
            ctrl.users.sort(
                function(a, b) {
                    if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
                    if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
                    return 0;
                }
            );
        }

        function appendResults (users) {
            if (ctrl.users.length===0) {
                ctrl.users= users;
            } else {
                _.each(users, function(user){
                    ctrl.users.push(user);
                });
            }
        }

        // Facebook

        function searchFriends () {
            Analytics.trackView('userSearchFromFacebook');
            if (ctrl.isFacebookSearch) {
                return;
            }
            ctrl.isFacebookSearch = true;
            ctrl.isTastdSearch = false;
            ctrl.isContactsSearch = false;
            ctrl.users = [];
            $ionicScrollDelegate.scrollTop();
            ctrl.loading = true;
            ctrl.searchCriteria.geoname = null;
            FacebookConnect.ensureHasCredential(me)
                .then(function() {
                    FriendManager.findAll()
                        .then(onGetFriendsSuccess, onGetFriendsError);
                });
        }

        function onGetFriendsSuccess(friends) {
            ctrl.users = friends;
            ctrl.loading = false;
        }

        function onGetFriendsError(restResponse) {
            if(restResponse.$response.data.id === 'Facebook') {
                return FacebookConnect.loginWithUpdateCredential(me).then(function(){
                    searchFriends();
                });
            }
            var context = ValidatorViolatedContext.getContextByRestResponse(restResponse);
            new IonicValidateOnSubmitPopup(context).alert();
        }

        function publishOnFb () {
            var url = 'https://tastdapp.com?invite&user=' + me.id;
            var title = $translate.instant('invite.share.title');
            var message = $translate.instant('invite.share.message');

            if (!window.plugins) {
                return window.alert('Share this link ' + url);
            }

            Analytics.trackEvent('share', 'invite');

            return $cordovaSocialSharing
                .share(message, title, null, url);
        }

    });
