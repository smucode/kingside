define([], function() {

    var Timer = function(timeout) {
        this._timer = null;
        this._timeout = timeout;
    };
    
    Timer.prototype.cancel = function() {
        if (this._timer) {
            window.clearTimeout(this._timer);
            this._timer = null;
        }
    };
    
    Timer.prototype.delay = function(fn) {
        this.cancel();
        this._timer = window.setTimeout(fn, this._timeout);
    };
    
    return Timer;
    
});
