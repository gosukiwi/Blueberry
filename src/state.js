var current_scope = null; // Name of function / method
var global_scope  = {};

// TODO: Also add the ones in USE

module.exports = {
  enterFunction: function (name) {
    current_scope = { name: name, values: {}, parent: current_scope };
  },

  leaveFunction: function (name) {
    current_scope = current_scope.parent;
  },

  clear: function () {
    current_scope = null;
    global_scope  = {};
  },

  add: function (name) {
    if(current_scope === null) {
      global_scope[name] = true;
      return;
    }

    current_scope.values[name] = true;
  },

  contains: function (name) {
    if(current_scope === null) {
      return global_scope[name] || false;
    }

    return current_scope.values[name] || false;
  }
};
