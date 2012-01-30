var vows = require('vows');
var assert = require('assert');
var db = require('../db.js').Db;

vows.describe('db').addBatch({
    'persist user data and read it back out' : {
     topic: function() {
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
            db.saveUser(undefined, this.callback);
        },
        'result from user save' : function(err, stat) {
            assert.isFalse(stat);
        }
    },
    'find user with email as key' : {
        topic: function() {
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
            var cb = this.callback;
            db.removeGames({w: 'w'}, function() {
                db.saveGame('id', 'w', 'b', 'fenelen', cb);
            });
        },
        'save game' : function(err, stat) {
            assert.isTrue(stat);
        }
    },
    'handles missing game data' : {
        topic: function() {
            db.saveGame(undefined, 'w', 'b', 'fen', this.callback);
        },
        'result from game save' : function(err, stat) {
            assert.isFalse(stat);
        }
    },
    'find game with one player' : {
        topic: function() {
            var cb = this.callback;
            db.removeGames({w: 'w'}, function() {
                db.saveGame('id', 'w', 'b', 'fenelen', function(done) {
                    if(done) {
                        db.findUserGames('w', cb);
                    }
                });
            });
        },
        'game found' : function(err, usr) {
            assert.equal(usr[0].w, 'w');
            assert.equal(usr[0].b, 'b');
            assert.equal(usr[0].fen, 'fenelen');
        }
    }
})["export"](module);

db.disconnect();
