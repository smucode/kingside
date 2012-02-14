require(['fooboard/test/r-buster'], function(buster) {
	console.log('--------------- foboard inside test -----------', buster);
	buster.testCase("fooboard", {
		"fooboard init": function () {
			assert(true);
		}
	});
	console.log('------------ fooboard done ----------------');
});

