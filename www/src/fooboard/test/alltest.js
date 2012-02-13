define('all-tests', ["r-buster", "fooboard_test"], function(buster) {
    console.log('----------- RUN ----------------');
    buster.run();
});
