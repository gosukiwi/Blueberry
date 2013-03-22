/*
 * Expression
 *  In IcedTea:
 *      And, Or
 *      >, <, >=, <=, ==, !=
 *      -, +, *, /
 *      Function Call
 *      String
 *      Number
 *      Identifier
 */
var outter_parser = function(obj) {
    var output,
        parser = {
            number: require('./number.js'),
            real_number: require('./real_number.js'),
            string: require('./string.js'),
            identifier: require('./identifier.js'),
            logical_operator: require('./logical_operator.js'),
            arithmetic: require('./arithmetic.js'),
            call: require('./call_expression.js'),
            comparison: require('./comparison.js'),
            concat: require('./concat.js'),
            bool: require('./bool.js'),
            nil: require('./nil.js'),
            range: require('./range.js'),
            array_identifier: require('./array_identifier.js')
        };

    switch(obj.type) {
        case 'NIL':
            output = parser.nil(obj);
            break;
        case 'BOOL':
            output = parser.bool(obj);
            break;
        case 'NUMBER':
            output = parser.number(obj);
            break;
        case 'REAL_NUMBER':
            output = parser.real_number(obj);
            break;
        case 'STRING':
            output = parser.string(obj);
            break;
        case 'CONCATENATION':
            output = parser.concat(obj);
            break;
        case 'ARITHMETIC':
            output = parser.arithmetic(obj);
            break;
        case 'RANGE':
            output = parser.range(obj);
            break;
        case 'CALL':
        case 'CALL_METHOD':
            output = parser.call(obj);
            break;
        case 'AND':
        case 'OR':
            output = parser.logical_operator(obj);
            break;
        case 'COMPARISON':
            output = parser.comparison(obj);
            break;
        case 'PARENS_EXPRESSION':
            output = '(' + outter_parser(obj.expression) + ')';
            break;
        case 'OBJECT_ATTRIBUTE_IDENTIFIER':
            // myObjectInstance.myAttribute
            output = '$' + parser.identifier(obj.object) + '->' + parser.identifier(obj.value);
            break;
        case 'INSTANCE_IDENTIFIER':
            // @myInstanceVariable
            output = '$this->' + parser.identifier(obj);
            break;
        case 'ARRAY_IDENTIFIER':
            output = parser.array_identifier(obj);
            break;
        case 'IDENTIFIER':
            // When an expression is parsed, it checks for a function call
            // or an identifier, the identifier will always be a variable n_n
            output = '$' + parser.identifier(obj);
            break;
        default:
            throw "Invalid expression type: " + obj.type;
            break;
    }
    
    return output;
};

module.exports = outter_parser;

