'use strict';

angular
    .module('states.settings')
    .controller('AccountCtrl', function (
        ConfirmPopup,
        Loader,
        $state,
        $scope,
        me,
        ValidatorManager,
        FlashMessageManager
    ) {

        var ctrl = this;
        ctrl.user = me;
        ctrl.form = {};
        ctrl.save = save;
        ctrl.delete = deleteAccount;
        $scope.$on('navbar.done', function(){
            ctrl.save();
        });

        function deleteAccount () {
            ConfirmPopup.create('popup.delete_account.title','popup.delete_account.text')
                .then(function (res) {
                    if (res) {
                        return Loader.track(
                            ctrl.user.$destroy()
                                .then(function () {
                                    $state.go('signin');
                                    Loader.$loading.hide();
                                }));
                    }
                });
        }

        function save () {
            ValidatorManager.validate(ctrl.form, $scope)
                .then(function(){
                    Loader.track(
                        ctrl.user.$save().$asPromise()
                            .then(function () {
                                FlashMessageManager.push('flash_message.account_updated', 'success');
                                $state.go('settings');
                            })
                    );
                });
        }



    });
