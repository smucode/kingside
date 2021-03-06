define(['./auth'], function(auth) {
    var Login = function() {
        var link = $('<a href="/auth/google/">Login</a>');
        $('.login').append(link);
        
        var user = auth.user;
        if (user) {
            this.user = user;
            link.html(user.firstname + ' ' + user.lastname);
        }
    };
    return Login;
});
