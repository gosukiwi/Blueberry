/*
 * A range
 */
module.exports = function(obj) {
    if(obj.type !== 'RANGE') {
        throw "This is not a range!";
    }

    var parser = require('./expression.js');

    return 'range(' + parser(obj.from) + ', ' + parser(obj.to) + ')';
};
