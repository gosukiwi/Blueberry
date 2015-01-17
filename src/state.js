var current_scope = null; // Name of function / method
var global_scope  = { values: {} };

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
  }
};
