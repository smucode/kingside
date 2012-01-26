var vows = require('vows');
var assert = require('assert');
var Db = require('../db.js').Db;

vows.describe('db').addBatch({
    'persist user data and read it back out' : {
     topic: function() {
        var db = new Db();
        var cb = this.callback;
        db.removeUsers({name: 'Testur'}, function() {
            db.saveUser({name: 'Testur', email: 'testur@gmail.com'}, cb);
        });
                                                                                         },
     'result from user save' : function(err, stat) {
        assert.isTrue(stat);
     }
    },
    'handles missing user data' : {
        topic: function() {
            var db = new Db();
            db.saveUser(undefined, this.callback);
        },
        'result from user save' : function(err, stat) {
            assert.isFalse(stat);
        }
    },
    'find user with email as key' : {
        topic: function() {
            var db = new Db();
            var cb = this.callback;
            db.removeUsers({name: 'Testur'}, function() {
                db.saveUser({name: 'Testur', email: 'testur@gmail.com'}, function(done){
                    if(done) {
                        db.findUser({email: 'testur@gmail.com'}, cb);
                    }
                });
            });

        },
        'user found' : function(err, usr) {
            assert.equal(usr[0].name, 'Testur');
        }
    },
    'find user with name as key' : {
        topic: function() {
            var db = new Db();
            var cb = this.callback;
            db.removeUsers({name: 'Testur'}, function() {
                db.saveUser({name: 'Testur', email: 'testur@gmail.com'}, function(done){
                    if(done) {
                        db.findUser({name: 'Testur'}, cb);
                    }
                });
            });
        },
        'user found' : function(err, usr) {
            assert.equal(usr[0].name, 'Testur');
            assert.equal(usr[0].email, 'testur@gmail.com');
        }
    },
    'persist game with players' : {
        topic: function() {
            var db = new Db();
            var cb = this.callback;
            db.removeGames({player1: 'player1'}, function() {
                db.saveGame('player1', 'player2', 'fenelen', cb);
            });
        },
        'save game' : function(err, stat) {
            assert.isTrue(stat);
        }
    },
    'handles missing game data' : {
        topic: function() {
            var db = new Db();
            db.saveGame(undefined, 'player2', 'fen', this.callback);
        },
        'result from game save' : function(err, stat) {
            assert.isFalse(stat);
        }
    },
    'find game with one player' : {
        topic: function() {
            var db = new Db();
            var cb = this.callback;
            db.removeGames({player1: 'player1'}, function() {
                db.saveGame('player1', 'player2', 'fenelen', function(done) {
                    if(done) {
                        db.findGame({player1: 'player1'}, cb);
                    }
                });
            });
        },
        'game found' : function(err, usr) {
            assert.equal(usr[0].player1, 'player1');
            assert.equal(usr[0].player2, 'player2');
            assert.equal(usr[0].fen, 'fenelen');
        }
    }
})["export"](module);
