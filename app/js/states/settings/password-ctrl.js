'use strict';

angular
    .module('states.settings')

    .controller('PasswordCtrl', function (
        $scope,
        me,
        $state,
        Loader,
        FlashMessageManager
    ) {

        var ctrl = this;
        ctrl.user = me;
        ctrl.validateOptions = {
            'password.old' : {
                minlength : {
                    min : 6
                }
            },
            'password.new' : {
                minlength : {
                    min : 6
                }
            },
            'password.newConfirm': {
                minlength : {
                    min : 6
                }
            }
        };

        $scope.password = {};

        $scope.$on('navbar.done', function(){
            ctrl.validateAndSubmit();
        });

        ctrl.validateAndSubmit = function () {
            ctrl.form.validateAndSubmit(ctrl.change, ctrl.validateOptions);
        };

        ctrl.change = function () {
            // validation client side?
            if ($scope.password.newConfirm === $scope.password.new) {
                var promise = ctrl.user.changePassword.$build({
                    oldPassword : $scope.password.old,
                    password : $scope.password.new
                }).$save().$asPromise();

                Loader.track(promise).then(function () {
                    FlashMessageManager.push('flash_message.password_updated', 'success');
                    $state.go('settings');
                });

            } else {
                $scope.password.newConfirm = '';
                $scope.password.new = '';
            }
        };

    });
