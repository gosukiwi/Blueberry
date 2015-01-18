var current_scope = null; 
var global_scope  = { values: {} };
var indent_level  = 0;
// Default options
// TODO: Be able to change options via compiler parameters and .bbrc file
var options       = {
  indent: '    '
};

// TODO: Also add the ones in USE

module.exports = {
  enterFunction: function (name) {
    current_scope = { name: name, values: {}, parent: current_scope };
  },

  leaveFunction: function () {
    current_scope = current_scope.parent;
  },

  clear: function () {
    current_scope = null;
    global_scope  = { values: {} };
  },

  add: function (name) {
    var scope = current_scope === null ? global_scope : current_scope;
    scope.values[name] = true;
  },

  contains: function (name) {
    var scope = current_scope === null ? global_scope : current_scope;
    return scope.values[name] || false;
  },

  each: function (cb) {
    var scope = current_scope === null ? global_scope : current_scope;
    Object.keys(scope.values).forEach(function (name) {
      cb(name);
    });
  },

  indent: function () {
    indent_level += 1;
  },

  dedent: function () {
    indent_level -= 1;
  },

  indentate: function () {
    var output = '';
    for(var i = 0; i < indent_level; i++) {
      output += options.indent;
    }
    return output;
  }
};
