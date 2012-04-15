require.config({
    baseUrl: 'www/src/fooboard/test'
});

require(['../fooboard'], function(Fooboard) {
    buster.testCase("Fooboard", {
        "possible to create": function () {
            console.error('fooboard.test')
            assert(true);
        }
	});
});