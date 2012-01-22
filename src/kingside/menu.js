define(['underscore'], function(_) {
    var Menu = function() {
        var links = {
            'user/cpu': ['local', 'garbo'],
            'cpu/user': ['garbo', 'local'],
            'user/user': ['local', 'local'],
            'cpu/cpu': ['garbo', 'garbo'],
            'remote': ['local', 'remote']
        };
        
        var target = $('.menu');
        _.each(links, function(v, k) {
            var that = this;
            var link = $('<a href="#" id="' + k + '">' + k + '</a>').click(function() {
                var id = $(this).attr('id');
                that.listener.apply(that.listener, links[id]);
            });
            target.append(link);
        }, this);
    };
    
    Menu.prototype.onStart = function(fn) {
        this.listener = fn;
    };
    
    return Menu;
});
