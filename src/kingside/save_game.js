define(['underscore', './socket', '../../src/rex/rex'], function(_, socket) {
    var SaveGame = function(player, rex) {
        this._gameId = "no id";
        this._player = player;
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
            var searchFilter = {gameId: this._gameId};
            if(this._player) {
                searchFilter = {player: this._player};
            }
            socket.emit('find_game', searchFilter);
        }, this));

        socket.on('find_game', _.bind(function (fens) {
            //list out all the possible games for this user
            console.log('found game ', fens);
        }, this));
    };

    return SaveGame;
});
