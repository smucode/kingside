jsx.declare('jsx.gui');

jsx.gui.TemplateEngine = function() {

  var tmplcache = {};
  
  var tmpl = function(str, data) {
      // Originally by John Resig - http://ejohn.org/ - MIT Licensed
      var fn = !/\W/.test(str) ?
        tmplcache[str] = tmplcache[str] ||
          tmpl(str) :
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
          "with(obj){p.push('" +
          str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
        + "');}return p.join('');");
      return data ? fn( data ) : fn;
  };

  return {
    process: function(str) {
      return tmpl(str);
    }
  }
}
