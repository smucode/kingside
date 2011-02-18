jsx.declare('jsx.util');

jsx.util.Observer = function() {
  var fns = [];
  return {
    subscribe: function(fn) {
      fns.push(fn);
    },
    notify: function() {
      var args = arguments;
      _.each(fns, function(fn) {
        fn.apply(null, args);
      });
    }
  };
};