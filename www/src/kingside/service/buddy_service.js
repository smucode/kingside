define(['underscore'], function(_) {
    var BuddyService = function() {
    };

    BuddyService.prototype.list = function(callback) {
        callback = callback || function() {};
        if (this._buddies) {
            callback(this._buddies);
        } else {
            $.getJSON('/buddies', _.bind(function(buddies) {
                this.log('got buddies: ', buddies);
                this._buddies = buddies;
            }, this));
        }
    };

    BuddyService.prototype.log = function() {
        if (this.debug) {
            console.log.apply(console, arguments);
        }
    };

    return new BuddyService();
});