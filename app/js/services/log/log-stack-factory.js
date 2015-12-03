'use strict';

angular
    .module('services.log')
    .factory('LogStack', function LogStackFactory(){

        var MAX_LENGTH = 1000;
        var LogStack = {
            push: push,
            getFullStack: getFullStack,
            stack: []
        };

        return LogStack;

        function getFullStack () {
            var result = '';
            _.each(LogStack.stack, function(s){
                result += s + '\n';
            });
            return result;
        }

        function push (args) {
            var logArgs = _.clone(args);
            if (LogStack.stack.length > MAX_LENGTH) {
                LogStack.stack.shift();
            }
            var logEntry = getLogDate() + logArgs[0];
            logArgs.shift();
            if (logArgs.length > 0) {
                logEntry += (' ' + getObjectString(logArgs));
            }
            LogStack.stack.push(logEntry);
        }

        function getObjectString (objs) {
            var res = '{';
            _.each (objs, function(obj){

                if (isScalar(obj)) {
                    res += ' ' + obj + ' ';
                } else {
                    for (var name in obj) {
                        if (obj.hasOwnProperty(name)) {
                            if (isScalar(obj[name])) {
                                res += ( name + ':' + obj[name] + ', ');
                            }
                        }
                    }
                }
            });
            res += '}';
            return res;
        }

        function isScalar(obj){
            return (/string|number|boolean/).test(typeof obj);
        }

        function getLogDate() {
            var date = new Date ();
            var formattedDate = date.getHours() + ':' + date.getMinutes() + ':' +
                date.getSeconds() + '.' + date.getMilliseconds();

            return '[' + formattedDate + ']';
        }

    });

