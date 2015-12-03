'use strict';

describe('entities.restmod', function () {

    var restmod, Track;

    beforeEach(module('entities.restmod'));

    beforeEach(inject(function ($injector) {
        restmod = $injector.get('restmod');
        Track = restmod.model('/api/tracks').mix('RestBase');
    }));

    describe('Collection.$orderBy', function () {

        var tracks, tracksData = [
            { id : 1, position : 2},
            { id : 3, position : 3},
            { id : 6, position : 1}
        ];

        beforeEach(function () {
            tracks = Track.$collection();
            tracks.$decode(tracksData);
        });

        it('should have a $orderBy method', function () {
            expect(tracks.$orderBy).toBeDefined();
        });

        it('should reorder collection item by expression', function () {
            tracks.$orderBy('position');

            expect(tracks[0].position).toBe(1);
            expect(tracks[1].position).toBe(2);
            expect(tracks[2].position).toBe(3);
        });

        it('should reorder collection item by expression reverse', function () {
            tracks.$orderBy('position', true);

            expect(tracks[0].position).toBe(3);
            expect(tracks[1].position).toBe(2);
            expect(tracks[2].position).toBe(1);
        });
    });

});
