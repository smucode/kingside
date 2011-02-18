var jsx = (function(window){
  
  var scriptPath;
  var f = function() {};
  
  var require = function(name, cb) {
    var xhr = new XMLHttpRequest();
    var url = scriptPath + name.replace(/\./g, '/') + '.js?r=' + Math.random();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        eval(xhr.responseText);
        console.log('loaded ' + name);
        window.setTimeout(function() {
          (cb || f)(ref(name));
        }, 100);
      }
    };
    xhr.open('GET', url);
    xhr.send('');
  };
  
  var ref = function(name) {
    var current = window;
    _.each(name.split('.'), function(part) {
      try {
        current = current[part];
      } catch(e) {
        console.error(name, e);
      }
    });
    return current;
  };
  
  var declare = function(name, fn) {
    var current = window;
    _.each(name.split('.'), function(part) {
      if (!current[part]) {
        current[part] = fn || {};
      }
      current = current[part];
    });
    return current;
  };
  
  (function() {
    _.each(document.getElementsByTagName('script'), function(s) {
      var pos;
      if ((pos = s.src.indexOf('jsx/jsx.js')) != -1) {
        scriptPath = s.src.substr(0, pos);
        _.breakLoop();
      }
    });
  })();
  
  return {
    f: f,
    declare: function(name, fn) {
      return declare(name, fn);
    },
    require: function(name, cb) {
      require(name, cb);
    }
  }

})(this);
