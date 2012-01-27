define(['underscore', './socket', '../../src/rex/rex'], function(_, socket) {
    var SaveGame = function(gameId, p1, p2, rex) {
        this._gameId = gameId;
        this._p1 = p1;
        this._p2 = p2;
        this._rex = rex;

        this._gamesSaved = [];
        this._saveGame();
        this._loadGame();
    }

    SaveGame.prototype._saveGame = function() {
        $('.save_game').click(_.bind(function () {
            socket.emit('save_game', this._gameId, this._p1, this._p2, this._rex.toString());
        }, this));

        socket.on('save_game', _.bind(function (gameId) {
            console.log('new game id', gameId);
            this._gamesSaved.push(gameId);
            this._gameId = gameId;
        }, this));
    };

    SaveGame.prototype._loadGame = function() {
        $('.load_game').click(_.bind(function () {
            socket.emit('find_game', this._gameId);
        }, this));

        socket.on('find_game',   _.bind(function (fen) {
            console.log('found game ', fen);
        }, this));
    };

    return SaveGame;
});
