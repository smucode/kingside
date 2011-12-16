jsx.declare('jsx.ioc');

jsx.ioc.IocContainer = function() {

  var done = {};
  var queue = [];
  var processing = false;

  var load = function() {
    if (!processing && queue.length !== 0) {
      processing = true;
      var name = queue.pop();
      jsx.require(name, function(fn) {
        processing = false;
        done[name.substr(name.lastIndexOf('.') + 1, name.length)] = fn();
        load();
      });
    }
    else if (!processing && queue.length === 0) {
      var name;
      for (name in done) {
        resolve(name, done[name]);
      }
    }
  };
  
  var resolve = function(name, fn) {
    var key;
    for (key in fn) {
      if (key.match(/^set/)) {
        var dep = key.substr(3, key.length);
        if (done[dep]) {
          fn[key](done[dep]);
        }
      }
    }
    (fn.init || jsx.f)();
  };

  var add = function(name) {
    queue.push(name);
  };
  
  var start = function() {
    load();
  };

  return {
    add: function(name) {
      add(name);
    },
    start: function() {
      start();
    }
  }
};
