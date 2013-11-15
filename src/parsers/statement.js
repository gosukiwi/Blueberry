/*
 * Parse a statement
 * statements are basically keywords or custom behaviour of a sentence
 * assign, def, if, and function call are all statements
 */
module.exports = function(obj) {
    var output = '',
        parser = {
            'empty': require('./empty.js'),
            'comment': require('./comment.js'),
            'assign': require('./assign.js'),
            'def': require('./def.js'),
            'if': require('./if.js'),
            'if_else': require('./if_else.js'),
            'call': require('./call_statement.js'),
            'array_identifier': require('./array_identifier_statement.js'),
            'class': require('./class.js'),
            'class_method': require('./class_method.js'),
            'instantiate': require('./instantiate.js'),
            'while': require('./while.js'),
            'for': require('./for.js'),
            'switch': require('./switch.js'),
            'try_catch': require('./try_catch.js')
        };

    switch(obj.type) {
        case 'ASSIGN':
        case 'ASSIGN_INSTANCE_VARIABLE':
        case 'ASSIGN_TERNARY_OPERATOR':
        case 'ASSIGN_DEFAULT_VALUE':
            output = parser.assign(obj);
            break;
        case 'INSTANTIATE':
            output = parser.instantiate(obj);
            break;
        case 'CLASS':
            output = parser.class(obj);
            break;
        case 'CLASS_METHOD':
            output = parser.class_method(obj);
            break;
        case 'DEF':
            output = parser.def(obj);
            break;
        case 'TRY_CATCH':
            output = parser.try_catch(obj);
            break;
        case 'SWITCH':
            output = parser.switch(obj);
            break;
        case 'FOR':
        case 'COMPOSITE_FOR':
            output = parser.for(obj);
            break;
        case 'WHILE':
            output = parser.while(obj);
            break;
        case 'IF':
            output = parser.if(obj);
            break;
        case 'IF_ELSE':
            output = parser.if_else(obj);
            break;
        case 'CALL_METHOD':
        case 'CALL':
            output = parser.call(obj);
            break;
        case 'ARRAY_IDENTIFIER':
            output = parser.array_identifier(obj);
            break;
        case 'COMMENT':
            output = parser.comment(obj);
            break;
        case 'EMPTY':
            output = parser.empty(obj);
            break;
        default:
            throw "Invalid statement type: " + obj.type;
            break;
    }

    return output;
};
