define(
    [
        'underscore',
        'socket.io'
    ], 
    function(_, io) {
        var socket = io.connect('http://queensi.de/');

        var RR = function() {
            socket.on('game_ready', _.bind(function(game) {
                console.log(game);
            }));
        };

        RR.prototype.requestGame = function() {
            socket.emit('request_game');
        };

        _.extend(GC.prototype, Backbone.Events);

        return RR;
    }
);