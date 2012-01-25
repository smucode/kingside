var vows = require('vows');
var assert = require('assert');
var Db = require('../db.js').Db;

vows.describe('db').addBatch({
    'persist user data and read it back out' : {
     topic: function() {
        var db = new Db();
        db.saveUser({name: 'Testur', email: 'testur@gmail.com'}, this.callback);
     },
     'result from user save' : function(err, stat) {
        assert.isTrue(stat);
     }
    },
    'find user with email as key' : {
        topic: function() {
            var db = new Db();
            var cb = this.callback;
            db.saveUser({name: 'Testur', email: 'testur@gmail.com'}, function(done){
                if(done) {
                    db.findUser({email: 'testur@gmail.com'}, cb);
                }
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
            db.saveUser({name: 'Testur', email: 'testur@gmail.com'}, function(done){
                if(done) {
                    db.findUser({name: 'Testur'}, cb);
                }
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
            db.saveGame('player1', 'player2', 'fenelen', this.callback);
        },
        'save game' : function(err, stat) {
            assert.isTrue(stat);
        }
    }

})["export"](module);
