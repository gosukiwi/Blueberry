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
    = "\"" s:[^"]+ "\"" 
    { return { 
        type: 'STRING', 
        value: s.join('') 
      } 
    }
    / "'" s:[^']+ "'" 
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
  / Switch
  / Try_Catch
  / Assign
  / Def
  / Class
  / Call
  / Comment
  / Empty

Block
  = statement*

Empty = val:[ \n\r\t]+ { return { type: 'EMPTY', value: val.join('') } }

Class_Access_Modifier
  = "private"
  / "public"
  / "protected"

Class_Attribute
  = access:Class_Access_Modifier space+ attr:Class_Attribute
  { return { type: 'CLASS_ATTRIBUTE', access: access, name: attr.name, value: attr.value || null } }
  / "@" id:identifier space+ "=" space+ val:And_Expression newline*
  { return { type: 'CLASS_ATTRIBUTE', access: 'public', name: id, value: val } }
  / "@" id:identifier newline*
  { return { type: 'CLASS_ATTRIBUTE', access: 'public', name: id, value: null } }
  / Comment
  / Empty

Class_Body
  = access:Class_Access_Modifier space+ def:Def
  { return { type: 'CLASS_METHOD', access: access, def: def } }
  / def:Def
  { return { type: 'CLASS_METHOD', access: 'public', def: def } }
  / Empty

Class
  = 
  "class" space+ id:identifier space* newline+
    a:Class_Attribute*
    b:Class_Body*
  "end"
  { return { type: 'CLASS', name: id, block:b, attributes: a } }


/* A try statement */

Try_Catch =
  "try" space* newline+
    tryBody:Block
  "catch" space* arg:identifier? newline+
    catchBody:Block
  "finally" space* newline+
    finallyBody:Block
  "end"
  { return { type: 'TRY_CATCH', try: tryBody, catch: catchBody, catch_argument: arg || null, finally: finallyBody } }  
  / "try" space* newline+
    tryBody:Block
  "catch" space* arg:identifier? newline+
    catchBody:Block
  "end"
  { return { type: 'TRY_CATCH', try: tryBody, catch: catchBody, catch_argument: arg || null, finally: null } }  

/* A switch statement */

Switch =
  "switch" space+ condition:And_Expression newline+
   cases:When_Group
  "end"
  { return { type: 'SWITCH', condition: condition, cases: cases } }

When_Condition_Group =
  e1:And_Expression space* "," space* e2:When_Condition_Group
  { return [e1].concat(e2); }
  / expr: And_Expression
  { return expr; }
  

When_Group 
  = space* "when" space+ c:When_Condition_Group newline+
   body:Block
   o:When_Group
  { return [{ condition: c, body: body }].concat(o); }
  / space* "when" space+ c:When_Condition_Group newline+
   body:Block
  { return { condition: c, body: body }; }
  / space* "else" newline+
    body:Block
  { return { condition: null, body: body } }

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
  "@" assign:Assign
  { return { type: 'ASSIGN_INSTANCE_VARIABLE', assignment: assign } } 
  /
  id:identifier space* "=" space* "new" space+ exp:And_Expression newline
  {
    return {
        type: 'INSTANTIATE',
        identifier: id,
        expression: exp
    }
  }
  / id:identifier space* "=" space* condition:And_Expression space* "?" space* t:And_Expression space* ":" space* f:And_Expression
  {
    return {
      type: 'ASSIGN_TERNARY_OPERATOR',
      identifier: id,
      condition: condition,
      left: t,
      right: f
    } 
  }
  / id:identifier space* "=" space* l:And_Expression space* "??" space* r:And_Expression
  {
    return {
      type: 'ASSIGN_DEFAULT_VALUE',
      identifier: id,
      left: l,
      right: r
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
  = l:Bool_Comparison space+ "and" space+ r:And_Expression
  { return { type: 'AND', left: l, right: r } }
  / l:Bool_Comparison space+ "or" space+ r:And_Expression
  { return { type: 'OR', left: l, right: r } }
  / Bool_Comparison

/* Boolean Comparison */
Bool_Comparison
  = l:Adition space* ">" space* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '>', left: l, right: r } }
  / l:Adition space* "<" space* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '<', left: l, right: r } }
  / l:Adition space* ">=" space* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '>=', left: l, right: r } }
  / l:Adition space* "<=" space* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '<=', left: l, right: r } }
  / l:Adition space* "==" space* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '==', left: l, right: r } }
  / l:Adition space* "!=" space* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '!=', left: l, right: r } }
  / Adition

/* Arithmetic operators */

Adition
  = l:Multiplicative space* "-" space* r:Adition
  { return { type: 'ARITHMETIC', operation: '-', left: l, right: r }; }
  / l:Multiplicative space* "+" space* r:Adition
  { return { type: 'ARITHMETIC', operation: '+', left: l, right: r }; }
  / Multiplicative

Multiplicative
  = l:Concat  space* "*" space* r:Multiplicative
  { return { type: 'ARITHMETIC', operation: '*', left: l, right: r }; }
  / l:Concat  space* "/" space* r:Multiplicative
  { return { type: 'ARITHMETIC', operation: '/', left: l, right: r }; }
  / Concat 

/* Concatenation */

Concat 
  = l:expression space* "&" space* r:Concat 
  { return { type: 'CONCATENATION', left: l, right: r }; }
  / expression

/* The most basic blocks besides tokens */
expression 
  = 
  "(" c:And_Expression ")"
  { return { type: 'PARENS_EXPRESSION', expression: c }; }
  / "not" space* e:And_Expression
  { return { type: 'BOOL_NOT', value: e } }
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

/* Array Identifier */

Array_Identifier
  = id:identifier "[" idx:And_Expression "]"
  { return { type: 'ARRAY_IDENTIFIER', name: id, index: idx } }

/* JSON Object! */
JSON_Item
  = Empty* name:And_Expression space* ":" space* value:And_Expression Empty*
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

