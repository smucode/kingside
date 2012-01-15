define(['underscore'], function(_) {
    
    var Status = function(opts) {
        this.dom = document.createElement('div');
        this.dom.className = 'status';
        this.dom.innerHTML = 'awesome chess powa...';
        opts.target.appendChild(this.dom);
    };
    
    Status.prototype.update = function(obj) {
        console.log(obj);
        if (!obj.finished) {
            var to_move = obj.active_color == 'w' ? 'white' : 'black';
            this.dom.innerHTML = to_move + ' to move...';
        } else {
            var winner = obj.active_color == 'b' ? 'white' : 'black';
            this.dom.innerHTML = winner + ' won...';
        }
    };
    
    return Status;
    
});