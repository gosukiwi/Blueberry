/*
  ICED TEA GRAMMAR
  Iced tea is a programming languages of the families of CoffeeScript and Python.
  The main inspiration is CoffeeScript
*/

start = Statement*

/* Define tokens */

newline = s:[\n\r]+ { return s.join(''); }
_ = [ \t]
integer = n:[0-9]+ { return { type: 'NUMBER', value: parseInt(n.join(''), 10) } }

real_number 
  = h:[0-9]+ "." t:[0-9]+ { 
    return {
      type: 'REAL_NUMBER',
      value: parseFloat(h.join('') + '.' + t.join(''))
    } 
  }

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
  = "/*" comment:(!"*/" .)* "*/"
  {
      var c = [],
          i;
      
      for(i = 0; i < comment.length; i += 1) {
          c.push(comment[i].join(''));
      }

      return { type: 'COMMENT', multiline: true, value: c.join('') };
  }
  / "#" comment:[^\n\r]*
  { return { type: 'COMMENT', multiline: false, value: comment.join('').trim() }; }

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

Statement
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
  = Statement*

Empty = val:[ \n\r\t]+ { return { type: 'EMPTY', value: val.join('') } }

/* Class Implementation */

Class_Access_Modifier
  = "private"
  / "public"
  / "protected"

Class_Attribute
  = access:Class_Access_Modifier _+ attr:Class_Attribute
  { return { type: 'CLASS_ATTRIBUTE', access: access, name: attr.name, value: attr.value || null } }
  / "@" id:identifier _+ "=" _+ val:And_Expression
  { return { type: 'CLASS_ATTRIBUTE', access: 'public', name: id, value: val } }
  / "@" id:identifier
  { return { type: 'CLASS_ATTRIBUTE', access: 'public', name: id, value: null } }
  / Comment
  / Empty

Class_Body
  = access:Class_Access_Modifier _+ def:Def
  { return { type: 'CLASS_METHOD', access: access, def: def } }
  / def:Def
  { return { type: 'CLASS_METHOD', access: 'public', def: def } }
  / Empty

Class_Head
  = "class" _+ name:identifier _* newline+
  { return { name: name, extends: null } }
  / "class" _+ name:identifier _+ "<" _+ parent:identifier _* newline+
  { return { name: name, extends: parent } }

Class
  = 
  head:Class_Head
    a:Class_Attribute*
    b:Class_Body*
  "end"
  { return { type: 'CLASS', name: head.name, extends: head.extends, block:b, attributes: a } }


/* A try Statement */

Try_Catch =
  "try" _* newline+
    tryBody:Block
  "catch" _* arg:identifier? newline+
    catchBody:Block
  "finally" _* newline+
    finallyBody:Block
  "end"
  { return { type: 'TRY_CATCH', try: tryBody, catch: catchBody, catch_argument: arg || null, finally: finallyBody } }  
  / "try" _* newline+
    tryBody:Block
  "catch" _* arg:identifier? newline+
    catchBody:Block
  "end"
  { return { type: 'TRY_CATCH', try: tryBody, catch: catchBody, catch_argument: arg || null, finally: null } }  

/* A switch Statement */

Switch =
  "switch" _+ condition:And_Expression newline+
   cases:When_Group
  "end"
  { return { type: 'SWITCH', condition: condition, cases: cases } }

When_Condition_Group =
  e1:And_Expression _* "," _* e2:When_Condition_Group
  { return [e1].concat(e2); }
  / expr: And_Expression
  { return expr; }
  

When_Group 
  = _* "when" _+ c:When_Condition_Group newline+
   body:Block
   o:When_Group
  { return [{ condition: c, body: body }].concat(o); }
  / _* "when" _+ c:When_Condition_Group newline+
   body:Block
  { return { condition: c, body: body }; }
  / _* "else" newline+
    body:Block
  { return { condition: null, body: body } }

/* A for Statement */
For =
  "for" _+ id:identifier _+ "in" _+ collection:And_Expression newline+
    body:Block
  "end"
  { return { type: 'FOR', name: id, collection:collection, body: body } }
  / "for" _+ key:identifier "," _* val:identifier _+ "in" _+ collection:And_Expression newline+
    body:Block
  "end"
  { return { type: 'COMPOSITE_FOR', key: key, value: val, collection:collection, body: body } }

/* A while Statement */

While
 = "while" _+ condition:And_Expression newline+
   body:Block
 "end"
 { return { type: 'WHILE', condition: condition, body: body } }

/* An if Statement */
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

If_Header = "if" _* exp:And_Expression _* newline+
  { return { type: 'IF', condition: exp } }

Elsif = _* "else" _+ i:If_Header b:Block "end"
  { return { type: 'IF', condition: i.condition, statements:b } }
  / _* "else" _+ i:If_Header es:Statement+ e:Elsif
  { return { type: 'IF_ELSE', condition: i.condition, if_true: es, else: e } }
  / _* "else" _* newline+ es:Statement+ "end"
  { return { type: 'ELSE', statements: es } }


Assign_Operartor = 
 "=" 
 { return 'BY_VALUE' }
 / "&="
 { return 'BY_REFERENCE' }

Assign
  = "@" assign:Assign
  { return { type: 'ASSIGN_INSTANCE_VARIABLE', assignment: assign } } 
  /
  id:identifier _* mode:Assign_Operartor _* "new" _+ exp:And_Expression
  {
    return {
        type: 'INSTANTIATE',
        identifier: id,
        expression: exp,
        mode: mode
    }
  }
  / id:identifier _* "=" _* condition:And_Expression _* "?" _* t:And_Expression _* ":" _* f:And_Expression
  {
    return {
      type: 'ASSIGN_TERNARY_OPERATOR',
      identifier: id,
      condition: condition,
      left: t,
      right: f
    } 
  }
  / id:identifier _* "=" _* l:And_Expression _* "??" _* r:And_Expression
  {
    return {
      type: 'ASSIGN_DEFAULT_VALUE',
      identifier: id,
      left: l,
      right: r
    } 
  }
  / id:identifier _* mode:Assign_Operartor _* exp:And_Expression
  {
    return {
      type: 'ASSIGN',
      identifier: id,
      expression: exp,
      mode: mode
    } 
  }
  

Def
  = "def" _+ id:identifier _* args:ArgList? _* newline+
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
  = "(" h:And_Expression t:(_* "," _* And_Expression)* ")" {
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
Argument_Identifier
 = "&" id:identifier
 { return { type: 'IDENTIFIER_BY_REFERENCE', value: id.value } }
 / identifier  

ArgList
 = "(" h:Argument_Identifier t:(_* "," _* Argument_Identifier)* ")" {
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
  _* id:identifier _* "(" _* ")"
  { return {
      type: 'CALL',
      identifier: id,
      args: null
    }
  }
  / id:identifier _* args:ExprList
  { return {
      type: 'CALL',
      identifier: id,
      args: args
    }
  }

/* END STATEMENTS */

/* AND and OR conditions */
And_Expression
  = l:Bool_Comparison _+ "and" _+ r:And_Expression
  { return { type: 'AND', left: l, right: r } }
  / l:Bool_Comparison _+ "or" _+ r:And_Expression
  { return { type: 'OR', left: l, right: r } }
  / Bool_Comparison

/* Boolean Comparison */
Bool_Comparison
  = l:Adition _* ">" _* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '>', left: l, right: r } }
  / l:Adition _* "<" _* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '<', left: l, right: r } }
  / l:Adition _* ">=" _* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '>=', left: l, right: r } }
  / l:Adition _* "<=" _* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '<=', left: l, right: r } }
  / l:Adition _* "==" _* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '==', left: l, right: r } }
  / l:Adition _* "!=" _* r:Bool_Comparison
  { return { type: 'COMPARISON', operator: '!=', left: l, right: r } }
  / Adition

/* Arithmetic operators */

Adition
  = l:Multiplicative _* "-" _* r:Adition
  { return { type: 'ARITHMETIC', operation: '-', left: l, right: r }; }
  / l:Multiplicative _* "+" _* r:Adition
  { return { type: 'ARITHMETIC', operation: '+', left: l, right: r }; }
  / Multiplicative

Multiplicative
  = l:Concat  _* "*" _* r:Multiplicative
  { return { type: 'ARITHMETIC', operation: '*', left: l, right: r }; }
  / l:Concat  _* "/" _* r:Multiplicative
  { return { type: 'ARITHMETIC', operation: '/', left: l, right: r }; }
  / Concat 

/* Concatenation */

Concat 
  = l:expression _* "&" _* r:Concat 
  { return { type: 'CONCATENATION', left: l, right: r }; }
  / expression

/* The most basic blocks besides tokens */
expression 
  = 
  "(" c:And_Expression ")"
  { return { type: 'PARENS_EXPRESSION', expression: c }; }
  / "not" _* e:And_Expression
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
  = Empty* name:And_Expression _* ":" _* value:And_Expression Empty*
  { return { name: name, value: value } }
JSON_Object
  = "{" h:JSON_Item t:(_* "," _* JSON_Item)* "}"
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
  = "[" h:And_Expression? t:(_* "," _* And_Expression)* "]" 
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

