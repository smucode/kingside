define(['./auth'], function(Auth) {
    var Login = function() {
        var link = $('<a href="auth/google/">Login</a>');
        $('.login').append(link);
        
        var auth = new Auth();
        auth.onAuth(function(user) {
            link.html(user.firstname + ' ' + user.lastname);
        });
    };
    return Login;
});
