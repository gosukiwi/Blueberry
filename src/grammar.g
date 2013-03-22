/*
  IcedTea Grammar

  Iced tea is a programming languages of the families of CoffeeScript and Python.
  The main inspiration is CoffeeScript

*/

start = statement*

/* Define atoms */

newline 
  = s:[\n\r]+ { return s.join(''); }
space = [ \t]
integer = n:[0-9]+ { return { type: 'NUMBER', value: parseInt(n.join(''), 10) } }

real_number 
  = h:[0-9]+ "." t:[0-9]+ { 
    return {
      type: 'REAL_NUMBER',
      value: parseFloat(h.join('') + '.' + t.join(''))
    } 
  }

number =
  integer
  / real_number

string 
    = "\"" s:[0-9a-zA-Z_?!'+\-=@#$%^&*/. \n\t]+ "\"" 
    { return { 
        type: 'STRING', 
        value: s.join('') 
      } 
    }
    / "'" s:["0-9a-zA-Z_?!+\-=@#$%^&*/. \n\t]+ "'" 
    { return { 
        type: 'STRING', 
        value: s.join('') 
      } 
    }

Comment
  = "#" s:[0-9a-zA-Z_?!+\-=@$%#^&*/. \t'"]* newline
  { return { type: 'COMMENT', value: s.join('').trim() }; }

/* Identifiers are the name variables and functions can have */
identifier
  = h:[a-zA-Z_] t:[a-zA-Z_0-9]* { return { type: 'IDENTIFIER', value: h + t.join('') } }

/* Terminals */
bool
  = "true"
  { return { type: 'BOOL', value: 'true' } }
  / "false"
  { return { type: 'BOOL', value: 'false' } }

nil
  = "nil" { return { type: 'NIL', value: 'NIL' } }



/* BEGIN STATEMENTS */

/* 
  A statement is a line of code basically 
  All statements will be ended with a ; when passed to PHP
  
  IMPORTANT! All statements must refer to And_Condition instead of Expression
  FOR NOW @___@
  Statements remain the same
*/

statement
  = 
  If
  / While
  / For
  / Assign
  / Def
  / Class
  / Call
  / Comment
  / Empty

Block
  = statement*

Empty = val:[ \n\r\t]+ { return { type: 'EMPTY', value: val.join('') } }

Class_Attribute 
  = "@" id:identifier space+ "=" space+ val:And_Expression newline*
  { return { type: 'CLASS_ATTRIBUTE_ASSIGNMENT', name: id, value: val } }
  / "@" id:identifier newline*
  { return { type: 'CLASS_ATTRIBUTE', name: id } }
  / Comment
  / Empty

Class_Body
  = Def
  / Empty

Class
  = 
  "class" space+ id:identifier space* newline+
    a:Class_Attribute*
    b:Class_Body*
  "end"
  { return { type: 'CLASS', name: id, block:b, attributes: a } }

/* A for statement */
For =
  "for" space+ id:identifier space+ "in" space+ collection:And_Expression newline+
    body:Block
  "end"
  { return { type: 'FOR', name: id, collection:collection, body: body } }
  / "for" space+ key:identifier "," space* val:identifier space+ "in" space+ collection:And_Expression newline+
    body:Block
  "end"
  { return { type: 'COMPOSITE_FOR', key: key, value: val, collection:collection, body: body } }

/* A while statement */

While
 = "while" space+ condition:And_Expression newline+
   body:Block
 "end"
 { return { type: 'WHILE', condition: condition, body: body } }

/* An if statement */
If
  = h:If_Header
       b:Block
  "end"
  {
    return {
      type: 'IF',
      condition: h.condition,
      statements: b
    }
  }
  / 
  h:If_Header
    b:Block
  e:Elsif

  {
    return {
      type: 'IF_ELSE',
      condition: h.condition,
      if_true: b,
      else: e
    }
  }

If_Header = "if" space* exp:And_Expression space* newline+
  { return { type: 'IF', condition: exp } }

Elsif = space* "else" space+ i:If_Header b:Block "end"
  { return { type: 'IF', condition: i.condition, statements:b } }
  / space* "else" space+ i:If_Header es:statement+ e:Elsif
  { return { type: 'IF_ELSE', condition: i.condition, if_true: es, else: e } }
  / space* "else" space* newline+ es:statement+ "end"
  { return { type: 'ELSE', statements: es } }


Assign
  = 
  "@" id:identifier space* "=" space* exp:And_Expression
  { return { type: 'ASSIGN_INSTANCE_VARIABLE', identifier: id, expression: exp } } 
  /
  id:identifier space* "=" space* "new" space+ exp:And_Expression newline
  {
    return {
        type: 'INSTANTIATE',
        identifier: id,
        expression: exp
    }
  }
  / id:identifier space* "=" space* exp:And_Expression
  {
    return {
      type: 'ASSIGN',
      identifier: id,
      expression: exp
    } 
  }
  

Def
  = "def" space+ id:identifier space* args:ArgList? space* newline+
    b:Block
  "end"
  { return {
      type: 'DEF',
      name: id,
      args: args,
      statements: b
    }
  }

/* STATEMENTS HELPERS */

/*
  Matches a set of arguments, the arguments are expressions so it can be
  pretty much anything
*/
ExprList
  = "(" h:And_Expression t:(space* "," space* And_Expression)* ")" {
    var values = [h]
      , i; 

    for(i = 0; i < t.length; i += 1) {
      values.push(t[i].pop());
    } 
    
    return {
      type: 'ARGUMENTS',
      values: values
    }
  }

/* 
  Sometimes (for function definitions)
  argument lists can only contain identifiers
*/
ArgList
 = "(" h:identifier t:(space* "," space* identifier)* ")" {
    var values = [h]
      , i; 

    for(i = 0; i < t.length; i += 1) {
      values.push(t[i].pop());
    } 
    
    return {
      type: 'ARGUMENTS',
      values: values
    }
  }

/*
  Matches a function call
*/
Call
  =
  id:identifier "." c:Call
  { return { type: 'CALL_METHOD', object: id, method: c } }
  /
  space* id:identifier space* "(" space* ")"
  { return {
      type: 'CALL',
      identifier: id,
      args: null
    }
  }
  / id:identifier space* args:ExprList
  { return {
      type: 'CALL',
      identifier: id,
      args: args
    }
  }

/* END STATEMENTS */

/* AND and OR conditions */
And_Expression
  = l:Or_Expression space+ "and" space+ r:And_Expression
  { return { type: 'AND', left: l, right: r } }
  / Or_Expression

Or_Expression
  = l:bool_comparison space+ "or" space+ r:Or_Expression
  { return { type: 'OR', left: l, right: r } }
  / substraction

/* Arithmetic operators */

substraction
  = l:additive space* "-" space* r:substraction
  { return { type: 'ARITHMETIC', operation: '-', left: l, right: r }; }
  / additive

additive
  = l:multiplicative space* "+" space* r:additive
  { return { type: 'ARITHMETIC', operation: '+', left: l, right: r }; }
  / multiplicative

multiplicative
  = l:division space* "*" space* r:multiplicative
  { return { type: 'ARITHMETIC', operation: '*', left: l, right: r }; }
  / division

division
  = l:concat space* "/" space* r:division
  { return { type: 'ARITHMETIC', operation: '/', left: l, right: r }; }
  / concat

/* Concatenation */

concat 
  = l:expression space* "&" space* r:concat
  { return { type: 'CONCATENATION', left: l, right: r }; }
  / expression

/* The most basic blocks besides tokens */
expression 
  = 
  "(" c:And_Expression ")"
  { return { type: 'PARENS_EXPRESSION', expression: c }; }
  / "not" space* e:And_Expression
  { return { type: 'BOOL_NOT', value: e } }
  / bool_comparison
  / Array_Identifier
  / Call
  / string
  / real_number
  / integer
  / bool
  / nil
  / l:identifier "." r:identifier
  { return { type: 'OBJECT_ATTRIBUTE_IDENTIFIER', object: l, value: r } }
  / identifier
  / "@" id:identifier 
  { return { type: 'INSTANCE_IDENTIFIER', value: id.value } }
  / "(" start:And_Expression ".." end:And_Expression ")"
  { return { type: 'RANGE', from:start, to:end } }
  / JSON_Object
  / Array_Create

/* Boolean Operations */
bool_operator
  = ">"
  / "<"
  / ">="
  / "<="
  / "=="
  / "!="

bool_comparison
  = "(" l:And_Expression space* op:bool_operator space* r:And_Expression ")"
  { return { type: 'COMPARISON', operator: op, left: l, right: r } }

/* Array Identifier */

Array_Identifier
  = id:identifier "[" idx:And_Expression "]"
  { return { type: 'ARRAY_IDENTIFIER', name: id, index: idx } }

/* JSON Object! */
JSON_Item
  = Empty* name:string space* ":" space* value:And_Expression Empty*
  { return { name: name, value: value } }
JSON_Object
  = "{" h:JSON_Item t:(space* "," space* JSON_Item)* "}"
  {
    var values = [h]
      , i; 

    for(i = 0; i < t.length; i += 1) {
      values.push(t[i].pop());
    } 
    
    return {
      type: 'JSON_ARRAY',
      values: values
    }
  }

/* Array creation shortcut */
Array_Create
  = "[" h:And_Expression? t:(space* "," space* And_Expression)* "]" 
  {
    var values = [h]
      , i; 

    for(i = 0; i < t.length; i += 1) {
      values.push(t[i].pop());
    } 
    
    return {
      type: 'ARRAY_CREATE',
      values: values
    }
  }

