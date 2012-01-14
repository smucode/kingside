if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["underscore"], function(__) {

    var Event = function() {
        var eventMap = {};

        this.addListener = function(event, listener) {
            if (typeof listener != "function") {
                throw new TypeError("Listener is not function");
            }
            
            eventMap[event] = eventMap[event] || [];
            eventMap[event].push(listener);
        };

        this._getMap = function() {
            return eventMap;
        };

        this.fire = function(event) {
            __.each(eventMap[event], function(f) {
                f();
            });
        };

    };
    return Event;
});
