define(['./auth'], function(auth) {
    var Login = function() {
        var link = $('<a href="auth/google/">Login</a>');
        $('.login').append(link);
        
        auth.onAuth(function(user) {
            link.html(user.firstname + ' ' + user.lastname);
        });
    };
    return Login;
});
