define(['underscore', 'backbone'], function(_, Backbone) {
    
    return Backbone.View.extend({

        el: $('#login'),

        initialize: function() {
            this.options.auth.getUser(_.bind(function(user) {
                $.get('src/views/login.html', _.bind(function(html) {
                    this.$el.html(_.template(html, {user: user}));
                }, this));
            }, this));
        }
    })
});