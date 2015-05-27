/*
 * Blueberry PEG grammar
 * Compile as follows: pegjs --cached src/grammar.g src/grammar.js
 */

start = Statement*

/* TOKENS
 *--------------------------------------------------------------------------*/

NewLine = s:[\n\r]+ { return s.join(''); }

Integer = n:[0-9]+ { return { type: 'NUMBER', value: parseInt(n.join(''), 10) } }

Comment
  = "/*" (!"*/" .)* "*/"
  { return { type: 'COMMENT' }; }
  / "#" comment:[^\n\r]*
  { return { type: 'COMMENT' }; }

_ = [ \t] // whistespace
  / Comment

Real_Number
  = h:[0-9]+ "." t:[0-9]+ {
    return {
      type: 'REAL_NUMBER',
      value: parseFloat(h.join('') + '.' + t.join(''))
    }
  }

String
  = '""' _*                     { return { type: 'STRING', value: "" };    }
  / '"' chars:Characters '"' _* { return { type: 'STRING', value: chars }; }

Characters
  = Characters:Single_Character+ { return Characters.join(""); }

Single_Character
  // any Unicode character except " or \ or control character
  = [^"\\\0-\x1F\x7f]
  / '\\"'  { return '"';  }
  / "\\\\" { return "\\"; }
  / "\\/"  { return "/";  }
  / "\\b"  { return "\b"; }
  / "\\f"  { return "\f"; }
  / "\\n"  { return "\n"; }
  / "\n"  { return "\n"; }
  / "\\r"  { return "\r"; }
  / "\\t"  { return "\t"; }

Symbol = ":" value:[A-Za-z_]+ { return { type: 'SYMBOL', value: value.join('') } }

/* Identifiers are the name variables and functions can have */
Identifier
  = h:[a-zA-Z_] t:[a-zA-Z_0-9]* { return { type: 'IDENTIFIER', value: h + t.join('') } }

/* Terminals */
Bool
  = "true"
  { return { type: 'BOOL', value: 'true' } }
  / "false"
  { return { type: 'BOOL', value: 'false' } }

Nil
  = "nil" { return { type: 'NIL', value: 'NIL' } }


/* STATEMENTS
 *--------------------------------------------------------------------------*/

Statement
  =
  If
  / While
  / For
  / Switch
  / Try_Catch
  / Assign
  / Return
  / Def
  / Class
  / Call
  / List_Comprehension
  / Empty
  / Comment

Block
  = Statement*

Empty
  = val:[ \n\r\t]+ { return { type: 'EMPTY', value: val.join('') } }

Return
  = "return" _+ exp:Binary_Expression
  { return { type: 'RETURN', exp: exp } }

/* Class Implementation */

Class_Access_Modifier
  = "private"
  / "protected"

Class_Attribute
  = access:Class_Access_Modifier _+ attr:Class_Attribute
  { return { type: 'CLASS_ATTRIBUTE', name: attr.name, value: attr.value || null } }
  / "@" id:Identifier _+ "=" _+ val:Binary_Expression
  { return { type: 'CLASS_ATTRIBUTE', name: id, value: val } }
  / "@" id:Identifier
  { return { type: 'CLASS_ATTRIBUTE', name: id, value: null } }
  / "self" "." id:Identifier _+ "=" _+ val:Binary_Expression
  { return { type: 'CLASS_STATIC_ATTRIBUTE', name: id, value: val } }

Class_Method
  = "def" _+ "self" "." id:Identifier _* args:Argument_List? _* NewLine+ b:Block "end"
  {
    return {
      type: 'STATIC_DEF',
      name: id,
      args: args,
      statements: b
    }
  }
  / def:Def NewLine*
  { return def }

Class_Block_Statement
  = _* method:Class_Method NewLine*
  { return method }
  / _* attribute:Class_Attribute NewLine*
  { return attribute }

Class_Method_Block
  = access:Class_Access_Modifier? _* NewLine* statements:Class_Block_Statement+
  { return { type: 'CLASS_METHOD_BLOCK', access: access ? access : 'public', statements: statements } }

Class_Body
  = _* NewLine* _* block:Class_Method_Block*
  { return block }

Class_Head
  = "class" _+ name:Identifier _+ "<" _+ parent:Identifier _* NewLine*
  { return { name: name, extends: parent } }
  / "class" _+ name:Identifier _* NewLine*
  { return { name: name, extends: null } }

Class
  =
  head:Class_Head body:Class_Body "end"
  { return { type: 'CLASS', name: head.name, extends: head.extends, block:body } }


/* A try Statement */

Try_Catch =
  "try" _* NewLine+
    tryBody:Block
  "catch" _* arg:Identifier? NewLine+
    catchBody:Block
  "finally" _* NewLine+
    finallyBody:Block
  "end"
  { return { type: 'TRY_CATCH', try: tryBody, catch: catchBody, catch_argument: arg || null, finally: finallyBody } }
  / "try" _* NewLine+
    tryBody:Block
  "catch" _* arg:Identifier? NewLine+
    catchBody:Block
  "end"
  { return { type: 'TRY_CATCH', try: tryBody, catch: catchBody, catch_argument: arg || null, finally: null } }

/* A switch Statement */

Switch =
  "switch" _+ condition:Binary_Expression NewLine+
   cases:When_Group
  "end"
  { return { type: 'SWITCH', condition: condition, cases: cases } }

When_Condition_Group =
  e1:Binary_Expression _* "," _* e2:When_Condition_Group
  { return [e1].concat(e2); }
  / expr: Binary_Expression
  { return expr; }


When_Group
  = _* "when" _+ c:When_Condition_Group NewLine+
   body:Block
   o:When_Group
  { return [{ condition: c, body: body }].concat(o); }
  / _* "when" _+ c:When_Condition_Group NewLine+
   body:Block
  { return { condition: c, body: body }; }
  / _* "else" NewLine+
    body:Block
  { return { condition: null, body: body } }

/* A for Statement */
For =
  "for" _+ id:Identifier _+ "in" _+ collection:Binary_Expression _* NewLine+
    body:Block
  "end"
  { return { type: 'FOR', name: id, collection:collection, body: body } }
  / "for" _+ key:Identifier ":" _* val:Identifier _+ "in" _+ collection:Binary_Expression NewLine+
    body:Block
  "end"
  { return { type: 'COMPOSITE_FOR', key: key, value: val, collection:collection, body: body } }

/* A while Statement */

While
 = "while" _+ condition:Binary_Expression NewLine+
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

If_Header = "if" _* exp:Binary_Expression _* NewLine+
  { return { type: 'IF', condition: exp } }

Elsif = _* "else" _+ i:If_Header b:Block "end"
  { return { type: 'IF', condition: i.condition, statements:b } }
  / _* "else" _+ i:If_Header es:Statement+ e:Elsif
  { return { type: 'IF_ELSE', condition: i.condition, if_true: es, else: e } }
  / _* "else" _* NewLine+ es:Statement+ "end"
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
  id:Identifier _* mode:Assign_Operartor _* "new" _+ exp:Binary_Expression
  {
    return {
        type: 'INSTANTIATE',
        identifier: id,
        expression: exp,
        mode: mode
    }
  }
  / id:Identifier _* "=" _* condition:Binary_Expression _* "?" _* t:Binary_Expression _* ":" _* f:Binary_Expression
  {
    return {
      type: 'ASSIGN_TERNARY_OPERATOR',
      identifier: id,
      condition: condition,
      left: t,
      right: f
    }
  }
  / id:Identifier _* "=" _* l:Binary_Expression _* "?:" _* r:Binary_Expression
  {
    return {
      type: 'ASSIGN_DEFAULT_VALUE',
      identifier: id,
      left: l,
      right: r
    }
  }
  / id:Call_Expression _* mode:Assign_Operartor _* exp:Binary_Expression
  {
    return {
      type: 'ASSIGN',
      identifier: id,
      expression: exp,
      mode: mode
    }
  }


Def
  = "def" _+ id:Identifier _* args:Argument_List? _* NewLine+ b:Block "end"
  {
    return {
      type: 'DEF',
      name: id,
      args: args,
      statements: b
    }
  }

/* STATEMENTS AND EXPRESSIONS
 * ---------------------------------------------------------------------------*/

List_Comprehension
  = "[" _* action:Binary_Expression _* "for" _* item:Identifier _* "in" _* collection:Binary_Expression _* "where" _* filter:Binary_Expression _* "]"
  { return { type: 'LIST_COMPREHENSION', action: action, item: item, collection: collection, filter: filter } }
  / "[" _* action:Binary_Expression _* "for" _* item:Identifier _* "in" _* collection:Binary_Expression _* "]"
  { return { type: 'LIST_COMPREHENSION', action: action, item: item, collection: collection, filter: null } }

/* STATEMENTS HELPERS */

/*
  Matches a set of arguments, the arguments are expressions so it can be
  pretty much anything
*/
Expression_List
  = "(" h:Binary_Expression t:(_* "," _* Binary_Expression)* ")" {
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
 = "&" id:Identifier
 { return { type: 'IDENTIFIER_BY_REFERENCE', value: id.value } }
 / Identifier

Argument_List
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

Optional_Argument_List
  = Argument_List
  / "(" _* ")"
  { return { type: 'ARGUMENTS', values: [] } }

/*
   Matches when calling a function, method or property
*/

Call
  =
  l:Method_Call "." r:Call
  { return { type: 'CALL_CHAIN', left:l, right:r } }
  / l:Method_Call "." r:Identifier
  { return { type: 'CALL_CHAIN', left:l, right:r } }
  / Method_Call

Method_Call
  =
  object:Identifier "." c:Function_Call
  { return { type: 'CALL_METHOD', object: object, method: c } }
  / Property_Call

Property_Call
  =
  object:Array_Expression "." property:Array_Expression
  { return { type: 'CALL_PROPERTY', object: object, property: property } }
  / Function_Call

Function_Call
  =
  _* id:Array_Expression _* "(" _* ")"
  { return {
      type: 'CALL',
      identifier: id,
      args: null
    }
  }
  / id:Array_Expression _* args:Expression_List
  { return {
      type: 'CALL',
      identifier: id,
      args: args
    }
  }

/* EXPRESSIONS
 * The most "global" expression is Binary_Expression
 *--------------------------------------------------------------------------*/

Binary_Expression
  = l:Bool_Comparison _+ "and" _+ r:Binary_Expression
  { return { type: 'AND', left: l, right: r } }
  / l:Bool_Comparison _+ "or" _+ r:Binary_Expression
  { return { type: 'OR', left: l, right: r } }
  / Bool_Comparison

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
  / l:Concat  _* "%" _* r:Multiplicative
  { return { type: 'ARITHMETIC', operation: '%', left: l, right: r }; }
  / Concat

/* Concatenation */
Concat
  = l:Array_Expression _* "&" _* r:Concat
  { return { type: 'CONCATENATION', left: l, right: r }; }
  / Call_Expression

Call_Expression
 = Call
  / Array_Expression

Array_Expression
  = e:Expression _* "[" _* idx:Binary_Expression _* "]"
  { return { type: 'ARRAY_IDENTIFIER', name: e, index: idx } }
  / Expression

/* The most basic blocks besides tokens */
Expression
  =
  Closure
  / "(" c:Binary_Expression ")"
  { return { type: 'PARENS_EXPRESSION', expression: c }; }
  / "not" _* e:Binary_Expression
  { return { type: 'BOOL_NOT', value: e } }
  / String
  / Symbol
  / Real_Number
  / Integer
  / Bool
  / Nil
  / Identifier
  / "@" id:Identifier
  { return { type: 'INSTANCE_IDENTIFIER', value: id.value } }
  / "(" start:Binary_Expression ".." end:Binary_Expression ")"
  { return { type: 'RANGE', from:start, to:end } }
  / JSON_Object
  / Array_Create
  / List_Comprehension

/* JSON Object! */
JSON_Item
  = Empty* name:Binary_Expression _* ":" _* value:Binary_Expression Empty*
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
  = "[" h:Binary_Expression? t:(_* "," _* Binary_Expression)* "]"
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

/* Closures */
Closure
  = args:Optional_Argument_List _* "use" _* use:Argument_List _* "->" _* body:Closure_Body
  { return { type: 'CLOSURE', args: args, use: use, body: body } }
  / args:Optional_Argument_List _* "->" _* body:Closure_Body
  { return { type: 'CLOSURE', args: args, use: null, body: body } }
  / "->" _* body:Closure_Body

Closure_Body
  = block: Block "end"
  { return { type: 'CLOSURE_BLOCK', block: block } }
  / Binary_Expression
