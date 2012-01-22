define(['underscore', './socket'], function(_, socket) {
    
    // remote
    
    var Remote = function(color, board) {
        this._color = color; 
        this._board = board;
         
        // board.onMove(_.bind(this.move, this));
        // var that = this;
        // $(this._board).bind('onMove', function(x, source, target) {
            // todo check color
        //     that._listener(source, target);
        // });
    };
    
    Remote.prototype.update = function(obj) {
        this._board.update(obj);
    };
    
    Remote.prototype.onMove = function(fn) {
        this._listener = fn;
    };
    
    Remote.prototype.getColor = function() {
        return this._color;
    };
        
    // factory
    
    var Factory = function() {
    };
    
    Factory.prototype.create = function(board, cb) {
        socket.on('game_ready', function(color) {
            cb(new Remote(color, board));
        });
        socket.emit('request_game');
    };
    
    return new Factory();

});
