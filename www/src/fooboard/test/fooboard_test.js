require.config({
    paths: {
        "underscore": 'www/lib/underscore/underscore'
    },
    baseUrl: '.'
});

require(['www/src/fooboard/fooboard'], function(Fooboard) {
    buster.testCase("Fooboard", {
        "possible to create": function () {
            assert(true);
        }
	});
});