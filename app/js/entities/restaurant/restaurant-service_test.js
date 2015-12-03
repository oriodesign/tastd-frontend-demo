describe('Restaurant', function () {

    var Restaurant;

    beforeEach(module('entities.restaurant'));

    beforeEach(inject(function ($injector) {
        Restaurant = $injector.get('Restaurant');
    }));

    describe('.$buildFromPlace()', function () {

        var restaurant, place = {
            name : 'Peppino',
            picture : 'http://www.image.com/1.jpeg',
            address : {}
        };

        beforeEach(function () {
            restaurant = Restaurant.$buildFromPlace(place);
        });

        it('Should build a restaurant from place data', function () {
            expect(restaurant).toBeDefined();
            expect(restaurant.name).toBe(place.name);
        });
    });

});

