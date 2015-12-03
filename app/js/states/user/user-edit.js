'use strict';

angular
    .module('states.user')
    .controller('UserEditCtrl', function (
            $scope,
            me,
            Loader,
            meEditValidateOptions,
            $state,
            Geoname,
            $cordovaCamera,
            $log,
            $stateParams,
            $ionicActionSheet,
            SimpleLocalStorage,
            GeonameManager,
            PhotoUpload,
            GeonameModal
    ) {

        var ctrl = this;

        ctrl.user            = me;
        ctrl.validateOptions = meEditValidateOptions;
        ctrl.geonames        = Geoname.$collection();
        ctrl.years           = _.range(2015,1910,-1);

        $scope.$on('navbar.done', function(){
            ctrl.submit();
        });

        ctrl.submit = function() {
            ctrl.editProfileForm.validateAndSubmit(function(){
                ctrl.update(ctrl.user);
            }, ctrl.validateOptions);
        };

        ctrl.update = function (user) {
            var promise = user.$save().$asPromise();

            promise.then(function () {
                $state.go('me');
            });

            Loader.track(promise);

            return promise;
        };

        ctrl.changeGeoname = function() {
            GeonameModal.create()
                .then(function(geoname) {
                    ctrl.user.geoname = geoname;
                    // also overwrite the setting for the map
                    SimpleLocalStorage.setObject('lastGeoname', geoname);
                    SimpleLocalStorage.setObject('restoSearchGeoname', geoname);
                });
        };

        ctrl.uploadPhoto = PhotoUpload.uploadPhotoFactory(function(imageData){
            ctrl.user.uploadedAvatar =  imageData;
            Loader.track(me.$save().$asPromise());
        });

        return ctrl;
    })

    .value('meEditValidateOptions',{
        firstName : {
            minlength : {
                min : 2
            }
        },
        lastName : {
            minlength : {
                min : 2
            }
        },
        headline : {
            minlength : {
                min : 5
            }
        },
        about : {
            minlength : {
                min : 5
            }
        }
    });
