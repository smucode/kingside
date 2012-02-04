if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require","vows","assert","../pubsub"], function(require, vows, assert, PubSub) {

vows.describe('PubSub').addBatch({
    'fire event' : {
        topic : PubSub,

        'no listeners added' : function(topic) {
            topic.pub('/foo', 'bar');
        },   
        'with listeners added' : function(topic) {
            var data = null;
            topic.sub('/foo', function(d) {
                data = d;
            });
            topic.pub('/foo', 'bar');
            assert.equal(data, 'bar');
        }   
    }
})["export"](module);

});
