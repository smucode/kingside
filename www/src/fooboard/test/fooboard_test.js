console.log('--------------- foboard test -----------');
define(['r-buster', '../fooboard'], function(buster, FooBoard) {
    console.log('--------------- foboard test -----------');
    buster.testCase("fooboard", {
      "fooboard init": function () {
          assert(true);
      }
    });

});

