describe('services.utility', function () {

    beforeEach(module('services.utility'));

    describe('Class', function () {
        var Class, Person, Ninja;

        beforeEach(inject(function (_Class_) {
            Class  = _Class_;
            Person = Class.extend({
                init: function(isDancing){
                    this.dancing = isDancing;
                },
                dance: function(){
                    return this.dancing;
                }
            });

            Ninja = Person.extend({
                init: function(){
                    this._super( false );
                },
                dance: function(){
                    // Call the inherited version of dance()
                    return this._super();
                },
                swingSword: function(){
                    return true;
                }
            });
        }));

        it('should work', function () {
            var p = new Person(true);
            expect(p.dance()).toBe(true); // => true

            var n = new Ninja();
            expect(n.dance()).toBe(false); // => false
            expect(n.swingSword()).toBe(true); // => true

            expect(p instanceof Person && p instanceof Class &&
            n instanceof Ninja && n instanceof Person && n instanceof Class).toBe(true);
        });
    });
});
