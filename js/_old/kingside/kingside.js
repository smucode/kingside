jsx.require('jsx.ioc.IocContainer', function() {
  kingside = (function() {
    window.onerror = function(e) {
      console.trace();
      throw e;
    };
    var ioc = new jsx.ioc.IocContainer();
    ioc.add('kingside.gui.Board');
    ioc.add('kingside.gui.Controls');
    ioc.add('kingside.core.StateController');
    ioc.start();
    return {};
  })();
});