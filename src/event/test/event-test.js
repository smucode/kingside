if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require","vows","assert","../event"], function(require, vows, assert, Event) {

vows.describe('Event').addBatch({
    'add event listener' : {
        topic : new Event(),

        'listener is added to the map' : function(topic) {
            var cb = function() {};
            topic.addListener('event', cb);
            var map = topic._getMap();
            assert.equal(cb, map.event[0]);
        },
        'fire notifies listeners' : function(topic) {
            var val = false;
            topic.addListener('event', function() {
                val = true;
            });
            topic.fire('event');
            assert.isTrue(val);
        }
    },
    'add multiple listeners': {
        topic: new Event(),
        'can attached multiple listeners' : function(topic) {
            var cb0 = function() {};
            var cb1 = function() {};
            topic.addListener('event', cb0);
            topic.addListener('event', cb1);

            var map = topic._getMap();
            assert.equal(cb0, map.event[0]);
            assert.equal(cb1, map.event[1]);
        },
        'fires multiple events' : function(topic) {
            var a = false, b = false;

            topic.addListener('event',  function() {
                a = true;
            });
        
            topic.addListener('event', function() {
                b = true;
            });

            topic.fire('event');
            assert.isTrue(a);
            assert.isTrue(b);
        }
    },
    'checks' : {
        topic: new Event(),
        'throws exception when listener is not a function' : function(topic) {
           assert.doesNotThrow(function() {
               topic.addListener('event', function() {});
           }, Error);
           assert.throws(function() {
               topic.addListener('event', 'not a function');
           }, TypeError);
        }   
    }
})["export"](module);

});
