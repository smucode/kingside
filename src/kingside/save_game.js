define(['underscore', './socket', '../../src/rex/rex'], function(_, socket) {
    var SaveGame = function(p1, rex) {
        this._gameId = "no id";
        this._p1 = p1;
        this._rex = rex;

        this._gamesSaved = [];
        this._saveGame();
        this._loadGame();
    }

    SaveGame.prototype._saveGame = function() {
        $('.save_game').click(_.bind(function () {
            socket.emit('save_game', this._gameId, this._player, this._rex.toString());
        }, this));

        //Need a way to get the game_id from remot, maybe the time te use the event bus...
        socket.on('save_game', _.bind(function (gameId) {
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
