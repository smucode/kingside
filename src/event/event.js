if (typeof module !== 'undefined' && typeof module.require === 'undefined') { module.require = require; }

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

        this.fire = function() {
            var args = Array.prototype.slice.call(arguments);
            __.each(eventMap[__.first(args)], function(f) {
                f.apply(this, __.rest(args));
            });
        };

    };
    return Event;
});