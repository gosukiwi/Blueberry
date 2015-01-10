/*
 * List comprehension.
 */

function buildClosure(id, body) { return 'function($' + id + '){ return ' + body + '; }'; }

module.exports = function(obj) {
    if(obj.type !== 'LIST_COMPREHENSION') {
        throw "This is not a JSON array!";
    }

    var expressionParser = require('./expression.js'),
        identifierParser = require('./identifier.js'),
        itemName,
        mapClosure,
        filterClosure,
        collection;

    itemName      = identifierParser(obj.item);
    mapClosure    = buildClosure(itemName, expressionParser(obj.action));
    collection    = expressionParser(obj.collection);

    if(obj.filter !== null) {
      filterClosure = buildClosure(itemName, expressionParser(obj.filter));
      return 'array_map(' + mapClosure + ', array_filter(' + collection + ', ' + filterClosure + '));';
    }

    return 'array_map(' + mapClosure + ', ' + collection + ');';
};
