//if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["underscore"], function(__) {
    var PubSub = function() {
        this.debug = false;
        
        // jt, if you see this. i am not proud, but it works
        // for some reason, this class gets newed twice
        // hence i must keep topics somewhere global
        var g = (typeof window != 'undefined' ? window : global);
        this.topics = g.___t = g.___t || {};
    };
    
    PubSub.prototype.pub = function(topic) {
        var args = __.toArray(arguments).slice(1);
        if (this.debug) {
			var listners = (this.topics[topic] ? this.topics[topic].length : 0);
            console.log('pub. topic: ' + topic + '. listeners: ' +  listners + '. args: ', args);
        }
        __.each(this.topics[topic], function(callback) {
            callback.apply(callback, args);
        });
    };
    
    PubSub.prototype.sub = function(topic, callback) {
        if (this.debug) {
            console.log('sub. topic: ' + topic + '. callback: ', callback);
        }
        this.topics[topic] = this.topics[topic] || [];
        this.topics[topic].push(callback);
    };
    
    PubSub.prototype.desub = function(topic, callback) {
        if (this.debug) {
            console.log('desub. topic: ' + topic + '. callback: ', callback);
        }
        this.topics[topic] = __.without(this.topics[topic], callback);
    };
    
    return new PubSub();
});