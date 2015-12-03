describe('services.utility', function () {

    var FakeType, object = { __type : 'MyClass' };

    beforeEach(function () {

        var fakeModule = angular.module('mock.services.utility', []);

        fakeModule.config( function (FakeTypeProvider) {
            FakeTypeProvider.options({
                property : '__type'
            });
        });


        module('services.utility', 'mock.services.utility');

        // Kickstart the injectors previously registered
        // with calls to angular.mock.module
        inject(function (_FakeType_) {
            FakeType = _FakeType_;
        });

    });

    describe('$$property()', function () {
        it('should exist and calling it should return "__type"', function () {
            expect(FakeType.$$property).toBeDefined();
            expect(FakeType.$$property()).toBe('__type');
        });
    });

    describe('$$get(object)', function () {
        it('should return property value', function () {
            expect(FakeType.$$get(object)).toBe('MyClass');
        });
    });

    describe('supports(object)', function () {
        it('should return true if object is supported', function () {
            expect(FakeType.supports(object)).toBe(true);
            expect(FakeType.supports({__type: function () { return ''; }})).toBe(true);
        });

        it('should return false if object is NOT supported', function () {
            expect(FakeType.supports({})).toBe(false);
            expect(FakeType.supports({__type : true })).toBe(false);
            expect(FakeType.supports({__type : [] })).toBe(false);
            expect(FakeType.supports({__type : null })).toBe(false);
            expect(FakeType.supports({__type : undefined })).toBe(false);
            expect(FakeType.supports({__type : 0 })).toBe(false);
            expect(FakeType.supports({__type : /^foo$/ })).toBe(false);
        });
    });

    describe('get', function () {
        it('should return the fake type', function () {
            expect(FakeType.get(object)).toBe('MyClass');
            expect(FakeType.get({__type: function () { return 'MyClass'; }})).toBe('MyClass');
        });

        it('should throw error for unsupported type', function () {
            expect(function () { FakeType.get({}); }).toThrow(new FakeType.$$errors.FakeTypeUnsupportedObjectError('__type'));
        });

        it('should throw error if property exists and it\'s a function but returned value is not a string', function () {
            expect(function () { FakeType.get({
                __type: function () {
                    return [];
                }
            }); }).toThrow(new FakeType.$$errors.FakeTypeIsFunctionButValueIsUnsupportedError());
        });
    });

    describe('check(object, fake)', function () {
        it('should check if object is typeof fake when fake is a string', function () {
            expect(FakeType.check(object, 'MyClass')).toBe(true);
        });
    });
});
