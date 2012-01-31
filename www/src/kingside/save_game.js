define(['underscore', './socket', './auth'], function(_, socket, auth) {
    var SaveGame = function() {
        auth.onAuth(_.bind(function(user) {
            this._loadGame(user);
        }, this));
    };

    SaveGame.prototype._loadGame = function(user) {
        socket.emit('find_game', user.email);
        socket.on('find_game', _.bind(function(fens) {
            //list out all the possible games for this user
            console.log('found game ', fens);
        }, this));
    };

    return SaveGame;
});
