(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Types$ViewGame = function (a) {
	return {$: 'ViewGame', a: a};
};
var $author$project$Types$ViewSetup = function (a) {
	return {$: 'ViewSetup', a: a};
};
var $author$project$Faction$Faction = function (a) {
	return {$: 'Faction', a: a};
};
var $author$project$Faction$beneGesserit = $author$project$Faction$Faction('Bene Gesserit');
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Ports$saveState = _Platform_outgoingPort('saveState', $elm$core$Basics$identity);
var $author$project$Ports$clearState = $author$project$Ports$saveState($elm$json$Json$Encode$null);
var $author$project$Faction$emperor = $author$project$Faction$Faction('Emperor');
var $author$project$Faction$fremen = $author$project$Faction$Faction('Fremen');
var $pzp1997$assoc_list$AssocList$D = function (a) {
	return {$: 'D', a: a};
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $pzp1997$assoc_list$AssocList$remove = F2(
	function (targetKey, _v0) {
		var alist = _v0.a;
		return $pzp1997$assoc_list$AssocList$D(
			A2(
				$elm$core$List$filter,
				function (_v1) {
					var key = _v1.a;
					return !_Utils_eq(key, targetKey);
				},
				alist));
	});
var $pzp1997$assoc_list$AssocList$insert = F3(
	function (key, value, dict) {
		var _v0 = A2($pzp1997$assoc_list$AssocList$remove, key, dict);
		var alteredAlist = _v0.a;
		return $pzp1997$assoc_list$AssocList$D(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(key, value),
				alteredAlist));
	});
var $pzp1997$assoc_list$AssocList$fromList = function (alist) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, result) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($pzp1997$assoc_list$AssocList$insert, key, value, result);
			}),
		$pzp1997$assoc_list$AssocList$D(_List_Nil),
		alist);
};
var $author$project$Faction$harkonnen = $author$project$Faction$Faction('Harkonnen');
var $author$project$Faction$spacingGuild = $author$project$Faction$Faction('Spacing Guild');
var $author$project$Main$initSetup = function (_v0) {
	var factions = _List_fromArray(
		[$author$project$Faction$harkonnen, $author$project$Faction$fremen, $author$project$Faction$emperor, $author$project$Faction$spacingGuild, $author$project$Faction$beneGesserit]);
	var factionDict = $pzp1997$assoc_list$AssocList$fromList(
		A2(
			$elm$core$List$map,
			function (faction) {
				return _Utils_Tuple2(faction, false);
			},
			factions));
	var model = {
		navbarExpanded: false,
		page: $author$project$Types$ViewSetup(
			{factions: factionDict})
	};
	return _Utils_Tuple2(model, $author$project$Ports$clearState);
};
var $elm$core$Debug$log = _Debug_log;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Types$Config = F3(
	function (cardShortNames, handLimits, doubleAddToHarkonnen) {
		return {cardShortNames: cardShortNames, doubleAddToHarkonnen: doubleAddToHarkonnen, handLimits: handLimits};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$Ports$decodeConfig = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'doubleAddToHarkonnen',
	$elm$json$Json$Decode$bool,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'handLimits',
		$elm$json$Json$Decode$bool,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'cardShortNames',
			$elm$json$Json$Decode$bool,
			$elm$json$Json$Decode$succeed($author$project$Types$Config))));
var $author$project$Types$AddCard = F2(
	function (a, b) {
		return {$: 'AddCard', a: a, b: b};
	});
var $author$project$Types$AssignBiddingPhaseCards = function (a) {
	return {$: 'AssignBiddingPhaseCards', a: a};
};
var $author$project$Types$ChangeCard = F3(
	function (faction, current, _new) {
		return {current: current, faction: faction, _new: _new};
	});
var $author$project$Types$ChangeCardViaModal = function (a) {
	return {$: 'ChangeCardViaModal', a: a};
};
var $author$project$Types$CloseModal = {$: 'CloseModal'};
var $author$project$Types$DiscardCard = F2(
	function (a, b) {
		return {$: 'DiscardCard', a: a, b: b};
	});
var $author$project$Types$FinishCombat = F2(
	function (a, b) {
		return {$: 'FinishCombat', a: a, b: b};
	});
var $author$project$Types$FinishConfigModal = {$: 'FinishConfigModal'};
var $author$project$Types$FinishHarkonnenCardSwap = function (a) {
	return {$: 'FinishHarkonnenCardSwap', a: a};
};
var $author$project$Types$ModalMsg = function (a) {
	return {$: 'ModalMsg', a: a};
};
var $author$project$Types$OpenAddCardModal = {$: 'OpenAddCardModal'};
var $author$project$Types$OpenBiddingPhaseModal = {$: 'OpenBiddingPhaseModal'};
var $author$project$Types$OpenChangeCardModal = F2(
	function (a, b) {
		return {$: 'OpenChangeCardModal', a: a, b: b};
	});
var $author$project$Types$OpenCombatModal = {$: 'OpenCombatModal'};
var $author$project$Types$OpenConfigModal = {$: 'OpenConfigModal'};
var $author$project$Types$OpenHarkonnenCardSwapModal = {$: 'OpenHarkonnenCardSwapModal'};
var $author$project$Types$OpenHistoryModal = function (a) {
	return {$: 'OpenHistoryModal', a: a};
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Card$Card = F2(
	function (a, b) {
		return {$: 'Card', a: a, b: b};
	});
var $author$project$Card$none = A2($author$project$Card$Card, 'None', 'None');
var $author$project$Card$toString = function (card) {
	var s = card.a;
	return s;
};
var $author$project$Card$cheapHero = A2($author$project$Card$Card, 'Cheap Hero', 'Hero');
var $author$project$Card$defensePoison = A2($author$project$Card$Card, 'Defense - Poison', 'D - Poison');
var $author$project$Card$defenseProjectile = A2($author$project$Card$Card, 'Defense - Projectile', 'D - Projectile');
var $author$project$Card$familyAtomics = A2($author$project$Card$Card, 'Family Atomics', 'Atomics');
var $author$project$Card$ghola = A2($author$project$Card$Card, 'Tleilaxu Ghola', 'Ghola');
var $author$project$Card$hajr = A2($author$project$Card$Card, 'Hajr', 'Hajr');
var $author$project$Card$karama = A2($author$project$Card$Card, 'Karama', 'Karama');
var $author$project$Card$truthTrance = A2($author$project$Card$Card, 'Truthtrance', 'Trance');
var $author$project$Card$useless = A2($author$project$Card$Card, 'Useless', 'Useless');
var $author$project$Card$weaponLasgun = A2($author$project$Card$Card, 'Weapon - Lasgun', 'W - Lasgun');
var $author$project$Card$weaponPoison = A2($author$project$Card$Card, 'Weapon - Poison', 'W - Poison');
var $author$project$Card$weaponProjectile = A2($author$project$Card$Card, 'Weapon - Projectile', 'W - Projectile');
var $author$project$Card$weatherControl = A2($author$project$Card$Card, 'Weather Control', 'Weather');
var $author$project$Card$uniqueCards = _List_fromArray(
	[$author$project$Card$weaponPoison, $author$project$Card$weaponProjectile, $author$project$Card$weaponLasgun, $author$project$Card$defensePoison, $author$project$Card$defenseProjectile, $author$project$Card$cheapHero, $author$project$Card$familyAtomics, $author$project$Card$hajr, $author$project$Card$karama, $author$project$Card$ghola, $author$project$Card$truthTrance, $author$project$Card$weatherControl, $author$project$Card$useless]);
var $author$project$Card$unknown = A2($author$project$Card$Card, 'Unknown', 'Unknown');
var $author$project$Card$cardsDict = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (c) {
			return _Utils_Tuple2(
				$author$project$Card$toString(c),
				c);
		},
		A2(
			$elm$core$List$cons,
			$author$project$Card$unknown,
			A2($elm$core$List$cons, $author$project$Card$none, $author$project$Card$uniqueCards))));
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Card$fromString = function (s) {
	return A2($elm$core$Dict$get, s, $author$project$Card$cardsDict);
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Card$decode = function () {
	var parse = function (s) {
		var _v0 = $author$project$Card$fromString(s);
		if (_v0.$ === 'Nothing') {
			return $elm$json$Json$Decode$fail('No card named \"' + (s + '\" exists'));
		} else {
			var c = _v0.a;
			return $elm$json$Json$Decode$succeed(c);
		}
	};
	return A2($elm$json$Json$Decode$andThen, parse, $elm$json$Json$Decode$string);
}();
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $author$project$Faction$atreides = $author$project$Faction$Faction('Atreides');
var $author$project$Faction$factions = _List_fromArray(
	[$author$project$Faction$atreides, $author$project$Faction$emperor, $author$project$Faction$fremen, $author$project$Faction$harkonnen, $author$project$Faction$spacingGuild, $author$project$Faction$beneGesserit]);
var $author$project$Faction$unknown = $author$project$Faction$Faction('Unknown');
var $author$project$Faction$factionsWithUnknown = A2(
	$elm$core$List$append,
	$author$project$Faction$factions,
	_List_fromArray(
		[$author$project$Faction$unknown]));
var $author$project$Faction$toString = function (faction) {
	var s = faction.a;
	return s;
};
var $author$project$Faction$factionsDict = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (f) {
			return _Utils_Tuple2(
				$author$project$Faction$toString(f),
				f);
		},
		$author$project$Faction$factionsWithUnknown));
var $author$project$Faction$fromString = function (s) {
	return A2($elm$core$Dict$get, s, $author$project$Faction$factionsDict);
};
var $author$project$Faction$decode = function () {
	var parse = function (s) {
		var _v0 = $author$project$Faction$fromString(s);
		if (_v0.$ === 'Nothing') {
			return $elm$json$Json$Decode$fail('No faction named \"' + (s + '\" exists'));
		} else {
			var f = _v0.a;
			return $elm$json$Json$Decode$succeed(f);
		}
	};
	return A2($elm$json$Json$Decode$andThen, parse, $elm$json$Json$Decode$string);
}();
var $author$project$Ports$decodeConstant = function (constant) {
	var handle = function (s) {
		return _Utils_eq(s, constant) ? $elm$json$Json$Decode$succeed(s) : $elm$json$Json$Decode$fail('Value ' + (s + (' does not match constant ' + constant)));
	};
	return A2($elm$json$Json$Decode$andThen, handle, $elm$json$Json$Decode$string);
};
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $author$project$Ports$decodeBid = function () {
	var typeDecoder = A2(
		$elm$json$Json$Decode$field,
		'type',
		$author$project$Ports$decodeConstant('tuple'));
	var decoder = A2(
		$elm$json$Json$Decode$field,
		'values',
		A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$index, 1, $author$project$Faction$decode),
			A2(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
				A2($elm$json$Json$Decode$index, 0, $author$project$Card$decode),
				$elm$json$Json$Decode$succeed(
					F2(
						function (card, faction) {
							return _Utils_Tuple2(card, faction);
						})))));
	return A2(
		$elm$json$Json$Decode$andThen,
		function (_v0) {
			return decoder;
		},
		typeDecoder);
}();
var $author$project$Types$CombatSide = F4(
	function (faction, weapon, defense, cheapHero) {
		return {cheapHero: cheapHero, defense: defense, faction: faction, weapon: weapon};
	});
var $author$project$Types$CombatCard = F2(
	function (card, discard) {
		return {card: card, discard: discard};
	});
var $author$project$Ports$decodeCombatCard = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'discard',
	$elm$json$Json$Decode$bool,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'card',
		$author$project$Card$decode,
		$elm$json$Json$Decode$succeed($author$project$Types$CombatCard)));
var $author$project$Ports$decodeCombatSide = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'cheapHero',
	$elm$json$Json$Decode$bool,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'defense',
		$author$project$Ports$decodeCombatCard,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'weapon',
			$author$project$Ports$decodeCombatCard,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'faction',
				$author$project$Faction$decode,
				$elm$json$Json$Decode$succeed($author$project$Types$CombatSide)))));
var $author$project$Types$AddCardModalMsg = function (a) {
	return {$: 'AddCardModalMsg', a: a};
};
var $author$project$Types$BiddingModalMsg = function (a) {
	return {$: 'BiddingModalMsg', a: a};
};
var $author$project$Types$CombatModalMsg = function (a) {
	return {$: 'CombatModalMsg', a: a};
};
var $author$project$Types$ConfigModalMsg = function (a) {
	return {$: 'ConfigModalMsg', a: a};
};
var $author$project$Types$HarkonnenCardSwapModalMsg = function (a) {
	return {$: 'HarkonnenCardSwapModalMsg', a: a};
};
var $author$project$Types$SelectIdentifyCard = function (a) {
	return {$: 'SelectIdentifyCard', a: a};
};
var $author$project$Types$SelectAddCardCard = function (a) {
	return {$: 'SelectAddCardCard', a: a};
};
var $author$project$Types$SelectAddCardFaction = function (a) {
	return {$: 'SelectAddCardFaction', a: a};
};
var $author$project$Ports$decodeAddCardModalMsg = function () {
	var chooseDecoder = function (typ) {
		switch (typ) {
			case 'SelectAddCardCard':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$SelectAddCardCard,
					A2(
						$elm$json$Json$Decode$field,
						'values',
						A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string)));
			case 'SelectAddCardFaction':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$SelectAddCardFaction,
					A2(
						$elm$json$Json$Decode$field,
						'values',
						A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string)));
			default:
				return $elm$json$Json$Decode$fail('Unknown AddCardModalMsg ' + typ);
		}
	};
	return A2(
		$elm$json$Json$Decode$andThen,
		chooseDecoder,
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
}();
var $author$project$Types$AddBid = {$: 'AddBid'};
var $author$project$Types$ResetBids = {$: 'ResetBids'};
var $author$project$Types$SelectBiddingCard = F2(
	function (a, b) {
		return {$: 'SelectBiddingCard', a: a, b: b};
	});
var $author$project$Types$SelectBiddingFaction = F2(
	function (a, b) {
		return {$: 'SelectBiddingFaction', a: a, b: b};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Ports$decodeBiddingModalMsg = function () {
	var chooseDecoder = function (typ) {
		switch (typ) {
			case 'SelectBiddingCard':
				return A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'values',
					A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'values',
						A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$int),
						$elm$json$Json$Decode$succeed($author$project$Types$SelectBiddingCard)));
			case 'SelectBiddingFaction':
				return A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'values',
					A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'values',
						A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$int),
						$elm$json$Json$Decode$succeed($author$project$Types$SelectBiddingFaction)));
			case 'AddBid':
				return $elm$json$Json$Decode$succeed($author$project$Types$AddBid);
			case 'ResetBids':
				return $elm$json$Json$Decode$succeed($author$project$Types$ResetBids);
			default:
				return $elm$json$Json$Decode$fail('Unknown BiddingModalMsg ' + typ);
		}
	};
	return A2(
		$elm$json$Json$Decode$andThen,
		chooseDecoder,
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
}();
var $author$project$Types$ResetCombatModal = {$: 'ResetCombatModal'};
var $author$project$Types$SelectDefense = F2(
	function (a, b) {
		return {$: 'SelectDefense', a: a, b: b};
	});
var $author$project$Types$SelectFaction = F2(
	function (a, b) {
		return {$: 'SelectFaction', a: a, b: b};
	});
var $author$project$Types$SelectWeapon = F2(
	function (a, b) {
		return {$: 'SelectWeapon', a: a, b: b};
	});
var $author$project$Types$ToggleCheapHero = function (a) {
	return {$: 'ToggleCheapHero', a: a};
};
var $author$project$Types$ToggleDefenseDiscard = function (a) {
	return {$: 'ToggleDefenseDiscard', a: a};
};
var $author$project$Types$ToggleWeaponDiscard = function (a) {
	return {$: 'ToggleWeaponDiscard', a: a};
};
var $author$project$Types$Left = {$: 'Left'};
var $author$project$Types$Right = {$: 'Right'};
var $author$project$Ports$decodeSide = function () {
	var parse = function (s) {
		switch (s) {
			case 'left':
				return $elm$json$Json$Decode$succeed($author$project$Types$Left);
			case 'right':
				return $elm$json$Json$Decode$succeed($author$project$Types$Right);
			default:
				var x = s;
				return $elm$json$Json$Decode$fail('Unknown side ' + x);
		}
	};
	return A2($elm$json$Json$Decode$andThen, parse, $elm$json$Json$Decode$string);
}();
var $author$project$Ports$decodeCombatModalMsg = function () {
	var chooseDecoder = function (typ) {
		switch (typ) {
			case 'SelectFaction':
				return A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'values',
					A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'values',
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeSide),
						$elm$json$Json$Decode$succeed($author$project$Types$SelectFaction)));
			case 'SelectWeapon':
				return A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'values',
					A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'values',
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeSide),
						$elm$json$Json$Decode$succeed($author$project$Types$SelectWeapon)));
			case 'SelectDefense':
				return A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'values',
					A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'values',
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeSide),
						$elm$json$Json$Decode$succeed($author$project$Types$SelectDefense)));
			case 'ToggleCheapHero':
				return A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'values',
					A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeSide),
					$elm$json$Json$Decode$succeed($author$project$Types$ToggleCheapHero));
			case 'ToggleWeaponDiscard':
				return A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'values',
					A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeSide),
					$elm$json$Json$Decode$succeed($author$project$Types$ToggleWeaponDiscard));
			case 'ToggleDefenseDiscard':
				return A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'values',
					A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeSide),
					$elm$json$Json$Decode$succeed($author$project$Types$ToggleDefenseDiscard));
			case 'ResetCombatModal':
				return $elm$json$Json$Decode$succeed($author$project$Types$ResetCombatModal);
			default:
				return $elm$json$Json$Decode$fail('Unknown CombatModalMsg ' + typ);
		}
	};
	return A2(
		$elm$json$Json$Decode$andThen,
		chooseDecoder,
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
}();
var $author$project$Types$ToggleCardShortNames = {$: 'ToggleCardShortNames'};
var $author$project$Types$ToggleDoubleAddToHarkonnen = {$: 'ToggleDoubleAddToHarkonnen'};
var $author$project$Types$ToggleHandLimits = {$: 'ToggleHandLimits'};
var $author$project$Ports$decodeConfigModalMsg = function () {
	var chooseDecoder = function (typ) {
		switch (typ) {
			case 'ToggleCardShortNames':
				return $elm$json$Json$Decode$succeed($author$project$Types$ToggleCardShortNames);
			case 'ToggleHandLimits':
				return $elm$json$Json$Decode$succeed($author$project$Types$ToggleHandLimits);
			case 'ToggleDoubleAddToHarkonnen':
				return $elm$json$Json$Decode$succeed($author$project$Types$ToggleDoubleAddToHarkonnen);
			default:
				return $elm$json$Json$Decode$fail('Unknown ConfigModalMsg ' + typ);
		}
	};
	return A2(
		$elm$json$Json$Decode$andThen,
		chooseDecoder,
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
}();
var $author$project$Types$SelectHarkonnenCardSwapMsg = function (a) {
	return {$: 'SelectHarkonnenCardSwapMsg', a: a};
};
var $author$project$Ports$decodeHarkonnenCardSwapModalMsg = function () {
	var chooseDecoder = function (typ) {
		if (typ === 'SelectHarkonnenCardSwapMsg') {
			return A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'values',
				A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed($author$project$Types$SelectHarkonnenCardSwapMsg));
		} else {
			return $elm$json$Json$Decode$fail('Unknown HarkonnenCardSwapModalMsg ' + typ);
		}
	};
	return A2(
		$elm$json$Json$Decode$andThen,
		chooseDecoder,
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
}();
var $author$project$Ports$decodeModalMsg = function () {
	var chooseDecoder = function (typ) {
		switch (typ) {
			case 'SelectIdentifyCard':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$elm$json$Json$Decode$map,
						$author$project$Types$SelectIdentifyCard,
						A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string)));
			case 'BiddingModalMsg':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$elm$json$Json$Decode$map,
						$author$project$Types$BiddingModalMsg,
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeBiddingModalMsg)));
			case 'AddCardModalMsg':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$elm$json$Json$Decode$map,
						$author$project$Types$AddCardModalMsg,
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeAddCardModalMsg)));
			case 'CombatModalMsg':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$elm$json$Json$Decode$map,
						$author$project$Types$CombatModalMsg,
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeCombatModalMsg)));
			case 'ConfigModalMsg':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$elm$json$Json$Decode$map,
						$author$project$Types$ConfigModalMsg,
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeConfigModalMsg)));
			case 'HarkonnenCardSwapModalMsg':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$elm$json$Json$Decode$map,
						$author$project$Types$HarkonnenCardSwapModalMsg,
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeHarkonnenCardSwapModalMsg)));
			default:
				return $elm$json$Json$Decode$fail('Unknown ModalMsg \"' + (typ + '\"'));
		}
	};
	return A2(
		$elm$json$Json$Decode$andThen,
		chooseDecoder,
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
}();
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$value = _Json_decodeValue;
function $author$project$Ports$cyclic$decodeGameMsg() {
	var typeDecoder = A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string);
	var chooseDecoder = function (typ) {
		var valuesDecoder = A2($elm$json$Json$Decode$field, 'values', $elm$json$Json$Decode$value);
		switch (typ) {
			case 'AddCard':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
						A2($elm$json$Json$Decode$index, 1, $author$project$Faction$decode),
						A2(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
							A2($elm$json$Json$Decode$index, 0, $author$project$Card$decode),
							$elm$json$Json$Decode$succeed($author$project$Types$AddCard))));
			case 'OpenHarkonnenCardSwapModal':
				return $elm$json$Json$Decode$succeed($author$project$Types$OpenHarkonnenCardSwapModal);
			case 'FinishHarkonnenCardSwap':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
						A2($elm$json$Json$Decode$index, 0, $author$project$Faction$decode),
						$elm$json$Json$Decode$succeed($author$project$Types$FinishHarkonnenCardSwap)));
			case 'ModalMsg':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$ModalMsg,
					A2(
						$elm$json$Json$Decode$field,
						'values',
						A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeModalMsg)));
			case 'DiscardCard':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
						A2($elm$json$Json$Decode$index, 1, $author$project$Faction$decode),
						A2(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
							A2($elm$json$Json$Decode$index, 0, $author$project$Card$decode),
							$elm$json$Json$Decode$succeed($author$project$Types$DiscardCard))));
			case 'OpenChangeCardModal':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
						A2($elm$json$Json$Decode$index, 1, $author$project$Card$decode),
						A2(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
							A2($elm$json$Json$Decode$index, 0, $author$project$Faction$decode),
							$elm$json$Json$Decode$succeed($author$project$Types$OpenChangeCardModal))));
			case 'ChangeCardViaModal':
				var requestDecoder = A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'new',
					$author$project$Card$decode,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'current',
						$author$project$Card$decode,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'faction',
							$author$project$Faction$decode,
							$elm$json$Json$Decode$succeed($author$project$Types$ChangeCard))));
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
						A2($elm$json$Json$Decode$index, 0, requestDecoder),
						$elm$json$Json$Decode$succeed($author$project$Types$ChangeCardViaModal)));
			case 'OpenBiddingPhaseModal':
				return $elm$json$Json$Decode$succeed($author$project$Types$OpenBiddingPhaseModal);
			case 'AssignBiddingPhaseCards':
				var msgDecoder = A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$AssignBiddingPhaseCards,
					$elm$json$Json$Decode$list($author$project$Ports$decodeBid));
				return A2($elm$json$Json$Decode$field, 'values', msgDecoder);
			case 'CloseModal':
				return $elm$json$Json$Decode$succeed($author$project$Types$CloseModal);
			case 'OpenCombatModal':
				return $elm$json$Json$Decode$succeed($author$project$Types$OpenCombatModal);
			case 'OpenAddCardModal':
				return $elm$json$Json$Decode$succeed($author$project$Types$OpenAddCardModal);
			case 'OpenConfigModal':
				return $elm$json$Json$Decode$succeed($author$project$Types$OpenConfigModal);
			case 'FinishConfigModal':
				return $elm$json$Json$Decode$succeed($author$project$Types$FinishConfigModal);
			case 'FinishCombat':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
						A2($elm$json$Json$Decode$index, 1, $author$project$Ports$decodeCombatSide),
						A2(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
							A2($elm$json$Json$Decode$index, 0, $author$project$Ports$decodeCombatSide),
							$elm$json$Json$Decode$succeed($author$project$Types$FinishCombat))));
			case 'OpenHistoryModal':
				return A2(
					$elm$json$Json$Decode$field,
					'values',
					A2(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
						A2(
							$elm$json$Json$Decode$index,
							0,
							$author$project$Ports$cyclic$decodeGameMsg()),
						$elm$json$Json$Decode$succeed($author$project$Types$OpenHistoryModal)));
			default:
				return $elm$json$Json$Decode$fail('Unknown type for GameMsg \"' + (typ + '\"'));
		}
	};
	return A2($elm$json$Json$Decode$andThen, chooseDecoder, typeDecoder);
}
try {
	var $author$project$Ports$decodeGameMsg = $author$project$Ports$cyclic$decodeGameMsg();
	$author$project$Ports$cyclic$decodeGameMsg = function () {
		return $author$project$Ports$decodeGameMsg;
	};
} catch ($) {
	throw 'Some top-level definitions from `Ports` are causing infinite recursion:\n\n  ┌─────┐\n  │    decodeGameMsg\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$Types$ModalAddCard = function (a) {
	return {$: 'ModalAddCard', a: a};
};
var $author$project$Types$ModalBidding = function (a) {
	return {$: 'ModalBidding', a: a};
};
var $author$project$Types$ModalChangeCard = function (a) {
	return {$: 'ModalChangeCard', a: a};
};
var $author$project$Types$ModalCombat = function (a) {
	return {$: 'ModalCombat', a: a};
};
var $author$project$Types$ModalConfig = function (a) {
	return {$: 'ModalConfig', a: a};
};
var $author$project$Types$ModalHarkonnenCardSwap = function (a) {
	return {$: 'ModalHarkonnenCardSwap', a: a};
};
var $author$project$Types$ModalHistory = function (a) {
	return {$: 'ModalHistory', a: a};
};
var $author$project$Types$ModalAddCardModel = F2(
	function (faction, card) {
		return {card: card, faction: faction};
	});
var $author$project$Ports$decodeModalAddCard = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'card',
	$author$project$Card$decode,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'faction',
		$author$project$Faction$decode,
		$elm$json$Json$Decode$succeed($author$project$Types$ModalAddCardModel)));
var $author$project$Types$ModalBiddingModel = F2(
	function (bids, factions) {
		return {bids: bids, factions: factions};
	});
var $elm$json$Json$Decode$array = _Json_decodeArray;
var $author$project$Ports$decodeModalBidding = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'factions',
	$elm$json$Json$Decode$list($author$project$Faction$decode),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'bids',
		$elm$json$Json$Decode$array($author$project$Ports$decodeBid),
		$elm$json$Json$Decode$succeed($author$project$Types$ModalBiddingModel)));
var $author$project$Types$ModalChangeCardModel = F3(
	function (faction, selectedCard, clickedCard) {
		return {clickedCard: clickedCard, faction: faction, selectedCard: selectedCard};
	});
var $author$project$Ports$decodeModalChangeCard = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'clickedCard',
	$author$project$Card$decode,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'selectedCard',
		$author$project$Card$decode,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'faction',
			$author$project$Faction$decode,
			$elm$json$Json$Decode$succeed($author$project$Types$ModalChangeCardModel))));
var $author$project$Types$ModalCombatModel = F2(
	function (left, right) {
		return {left: left, right: right};
	});
var $author$project$Ports$decodeModalCombat = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'right',
	$author$project$Ports$decodeCombatSide,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'left',
		$author$project$Ports$decodeCombatSide,
		$elm$json$Json$Decode$succeed($author$project$Types$ModalCombatModel)));
var $author$project$Types$ModalHarkonnenCardSwapModel = function (target) {
	return {target: target};
};
var $author$project$Ports$decodeModalHarkonnenCardSwap = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'target',
	$author$project$Faction$decode,
	$elm$json$Json$Decode$succeed($author$project$Types$ModalHarkonnenCardSwapModel));
var $author$project$Ports$decodeModal = function () {
	var decide = function (s) {
		switch (s) {
			case 'ModalChangeCard':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$ModalChangeCard,
					A2($elm$json$Json$Decode$field, 'value', $author$project$Ports$decodeModalChangeCard));
			case 'ModalBidding':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$ModalBidding,
					A2($elm$json$Json$Decode$field, 'value', $author$project$Ports$decodeModalBidding));
			case 'ModalCombat':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$ModalCombat,
					A2($elm$json$Json$Decode$field, 'value', $author$project$Ports$decodeModalCombat));
			case 'ModalAddCard':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$ModalAddCard,
					A2($elm$json$Json$Decode$field, 'value', $author$project$Ports$decodeModalAddCard));
			case 'ModalConfig':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$ModalConfig,
					A2($elm$json$Json$Decode$field, 'value', $author$project$Ports$decodeConfig));
			case 'ModalHistory':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$ModalHistory,
					A2($elm$json$Json$Decode$field, 'value', $author$project$Ports$decodeGameMsg));
			case 'ModalHarkonnenCardSwap':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$ModalHarkonnenCardSwap,
					A2($elm$json$Json$Decode$field, 'value', $author$project$Ports$decodeModalHarkonnenCardSwap));
			default:
				return $elm$json$Json$Decode$fail('Unknown modal type ' + s);
		}
	};
	var decoder = A2(
		$elm$json$Json$Decode$andThen,
		decide,
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
	return decoder;
}();
var $author$project$Ports$decodeSavedBiddingPhaseModalModel = $author$project$Ports$decodeModalBidding;
var $author$project$Ports$decodeSavedCombatModalModel = $author$project$Ports$decodeModalCombat;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, pathDecoder, input);
			if (_v0.$ === 'Ok') {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (_v1.$ === 'Ok') {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					var finalErr = _v1.a;
					return $elm$json$Json$Decode$fail(
						$elm$json$Json$Decode$errorToString(finalErr));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var $author$project$Types$Player = F2(
	function (faction, hand) {
		return {faction: faction, hand: hand};
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Card$encode = function (card) {
	var s = card.a;
	return $elm$json$Json$Encode$string(s);
};
var $author$project$Faction$encode = function (faction) {
	var s = faction.a;
	return $elm$json$Json$Encode$string(s);
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$Ports$playerBicoder = function () {
	var encoder = function (player) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'faction',
					$author$project$Faction$encode(player.faction)),
					_Utils_Tuple2(
					'hand',
					A2($elm$json$Json$Encode$list, $author$project$Card$encode, player.hand))
				]));
	};
	var decoder = A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'hand',
		$elm$json$Json$Decode$list($author$project$Card$decode),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'faction',
			$author$project$Faction$decode,
			$elm$json$Json$Decode$succeed($author$project$Types$Player)));
	return {decode: decoder, encode: encoder};
}();
var $norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging = {$: 'NotDragging'};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$init = $norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging;
var $author$project$Ports$smallGame = F6(
	function (players, maybeModal, maybeSavedBiddingModel, maybeSavedCombatModel, config, history) {
		return {config: config, dragDrop: $norpan$elm_html5_drag_drop$Html5$DragDrop$init, history: history, modal: maybeModal, navbarExpanded: false, players: players, savedBiddingPhaseModalModel: maybeSavedBiddingModel, savedCombatModalModel: maybeSavedCombatModel};
	});
var $author$project$Ports$decodeGame = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'history',
	$elm$json$Json$Decode$list($author$project$Ports$decodeGameMsg),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'config',
		$author$project$Ports$decodeConfig,
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'savedCombatModalModel',
			$elm$json$Json$Decode$nullable($author$project$Ports$decodeSavedCombatModalModel),
			$elm$core$Maybe$Nothing,
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'savedBiddingPhaseModalModel',
				$elm$json$Json$Decode$nullable($author$project$Ports$decodeSavedBiddingPhaseModalModel),
				$elm$core$Maybe$Nothing,
				A4(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'modal',
					$elm$json$Json$Decode$nullable($author$project$Ports$decodeModal),
					$elm$core$Maybe$Nothing,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'players',
						$elm$json$Json$Decode$list($author$project$Ports$playerBicoder.decode),
						$elm$json$Json$Decode$succeed($author$project$Ports$smallGame)))))));
var $author$project$Ports$parseGame = function (input) {
	return A2($elm$json$Json$Decode$decodeValue, $author$project$Ports$decodeGame, input);
};
var $author$project$Main$init = function (appState) {
	var savedState = A2(
		$elm$core$Debug$log,
		'input = ',
		A2(
			$elm$core$Maybe$map,
			function (state) {
				return $author$project$Ports$parseGame(state);
			},
			appState));
	var _v0 = A2($elm$core$Debug$log, 'actual input = ', appState);
	if ((savedState.$ === 'Just') && (savedState.a.$ === 'Ok')) {
		var game = savedState.a.a;
		return _Utils_Tuple2(
			{
				navbarExpanded: false,
				page: $author$project$Types$ViewGame(game)
			},
			$elm$core$Platform$Cmd$none);
	} else {
		return $author$project$Main$initSetup(_Utils_Tuple0);
	}
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Faction$eq = F2(
	function (fac1, fac2) {
		var _v0 = _Utils_Tuple2(fac1, fac2);
		var s1 = _v0.a.a;
		var s2 = _v0.b.a;
		return _Utils_eq(s1, s2);
	});
var $author$project$Main$handLimit = function (faction) {
	return A2($author$project$Faction$eq, $author$project$Faction$harkonnen, faction) ? 8 : 4;
};
var $author$project$Main$updateFaction = F3(
	function (map, faction, players) {
		var maybeUpdate = function (player) {
			return _Utils_eq(player.faction, faction) ? map(player) : player;
		};
		return A2($elm$core$List$map, maybeUpdate, players);
	});
var $author$project$Main$addCardToPlayer = F4(
	function (config, card, faction, players) {
		var add = function (player) {
			return (config.handLimits && (_Utils_cmp(
				$elm$core$List$length(player.hand),
				$author$project$Main$handLimit(player.faction)) > -1)) ? player : _Utils_update(
				player,
				{
					hand: A2($elm$core$List$cons, card, player.hand)
				});
		};
		return A3($author$project$Main$updateFaction, add, faction, players);
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $author$project$Card$eq = F2(
	function (card1, card2) {
		var _v0 = _Utils_Tuple2(card1, card2);
		var _v1 = _v0.a;
		var s1 = _v1.a;
		var _v2 = _v0.b;
		var s2 = _v2.a;
		return _Utils_eq(s1, s2);
	});
var $author$project$Main$changeCard = F3(
	function (current, _new, cards) {
		if (!cards.b) {
			return _List_Nil;
		} else {
			var head = cards.a;
			var tail = cards.b;
			return A2($author$project$Card$eq, head, current) ? A2($elm$core$List$cons, _new, tail) : A2(
				$elm$core$List$cons,
				head,
				A3($author$project$Main$changeCard, current, _new, tail));
		}
	});
var $author$project$Main$createPlayer = function (faction) {
	var cards = A2($author$project$Faction$eq, $author$project$Faction$harkonnen, faction) ? _List_fromArray(
		[$author$project$Card$unknown, $author$project$Card$unknown]) : (A2($author$project$Faction$eq, $author$project$Faction$atreides, faction) ? _List_Nil : _List_fromArray(
		[$author$project$Card$unknown]));
	return {faction: faction, hand: cards};
};
var $author$project$Main$initConfig = {cardShortNames: false, doubleAddToHarkonnen: true, handLimits: true};
var $author$project$Main$createGame = function (factions) {
	var withoutAtreides = A2(
		$elm$core$List$filter,
		function (f) {
			return !A2($author$project$Faction$eq, $author$project$Faction$atreides, f);
		},
		factions);
	var players = A2(
		$elm$core$List$map,
		$author$project$Main$createPlayer,
		A2($elm$core$List$cons, $author$project$Faction$atreides, withoutAtreides));
	return {config: $author$project$Main$initConfig, dragDrop: $norpan$elm_html5_drag_drop$Html5$DragDrop$init, history: _List_Nil, modal: $elm$core$Maybe$Nothing, navbarExpanded: false, players: players, savedBiddingPhaseModalModel: $elm$core$Maybe$Nothing, savedCombatModalModel: $elm$core$Maybe$Nothing};
};
var $author$project$Modal$Combat$init = function () {
	var initialSide = {
		cheapHero: false,
		defense: {card: $author$project$Card$none, discard: false},
		faction: $author$project$Faction$unknown,
		weapon: {card: $author$project$Card$none, discard: false}
	};
	return {left: initialSide, right: initialSide};
}();
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm_community$list_extra$List$Extra$remove = F2(
	function (x, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var y = xs.a;
			var ys = xs.b;
			return _Utils_eq(x, y) ? ys : A2(
				$elm$core$List$cons,
				y,
				A2($elm_community$list_extra$List$Extra$remove, x, ys));
		}
	});
var $author$project$Main$removeFirst = F2(
	function (card, cards) {
		if (cards.b) {
			var head = cards.a;
			var tail = cards.b;
			return _Utils_eq(card, head) ? tail : A2(
				$elm$core$List$cons,
				head,
				A2($author$project$Main$removeFirst, card, tail));
		} else {
			return _List_Nil;
		}
	});
var $author$project$Main$replaceOrInsert = F2(
	function (card, cards) {
		if (!cards.b) {
			return _List_fromArray(
				[card]);
		} else {
			var h = cards.a;
			var t = cards.b;
			return A2($author$project$Card$eq, h, $author$project$Card$unknown) ? A2($elm$core$List$cons, card, t) : A2(
				$elm$core$List$cons,
				h,
				A2($author$project$Main$replaceOrInsert, card, t));
		}
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Ports$encodeCombatSide = function (side) {
	var encodeCombatCard = function (combatCard) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'card',
					$author$project$Card$encode(combatCard.card)),
					_Utils_Tuple2(
					'discard',
					$elm$json$Json$Encode$bool(combatCard.discard))
				]));
	};
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'faction',
				$author$project$Faction$encode(side.faction)),
				_Utils_Tuple2(
				'weapon',
				encodeCombatCard(side.weapon)),
				_Utils_Tuple2(
				'defense',
				encodeCombatCard(side.defense)),
				_Utils_Tuple2(
				'cheapHero',
				$elm$json$Json$Encode$bool(side.cheapHero))
			]));
};
var $author$project$Ports$encodeCombatModalModel = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'left',
				$author$project$Ports$encodeCombatSide(model.left)),
				_Utils_Tuple2(
				'right',
				$author$project$Ports$encodeCombatSide(model.right))
			]));
};
var $author$project$Ports$encodeConfig = function (config) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'cardShortNames',
				$elm$json$Json$Encode$bool(config.cardShortNames)),
				_Utils_Tuple2(
				'handLimits',
				$elm$json$Json$Encode$bool(config.handLimits)),
				_Utils_Tuple2(
				'doubleAddToHarkonnen',
				$elm$json$Json$Encode$bool(config.doubleAddToHarkonnen))
			]));
};
var $author$project$Ports$encodeType = F2(
	function (typeName, values) {
		if (!values.b) {
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string(typeName))
					]));
		} else {
			var list = values;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string(typeName)),
						_Utils_Tuple2(
						'values',
						A2(
							$elm$json$Json$Encode$list,
							function (x) {
								return x;
							},
							list))
					]));
		}
	});
var $author$project$Ports$encodeAddCardModalMsg = function (msg) {
	if (msg.$ === 'SelectAddCardCard') {
		var s = msg.a;
		return A2(
			$author$project$Ports$encodeType,
			'SelectAddCardCard',
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(s)
				]));
	} else {
		var s = msg.a;
		return A2(
			$author$project$Ports$encodeType,
			'SelectAddCardFaction',
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(s)
				]));
	}
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Ports$encodeBiddingModalMsg = function (msg) {
	switch (msg.$) {
		case 'SelectBiddingCard':
			var index = msg.a;
			var s = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'SelectBiddingCard',
				_List_fromArray(
					[
						$elm$json$Json$Encode$int(index),
						$elm$json$Json$Encode$string(s)
					]));
		case 'SelectBiddingFaction':
			var index = msg.a;
			var s = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'SelectBiddingFaction',
				_List_fromArray(
					[
						$elm$json$Json$Encode$int(index),
						$elm$json$Json$Encode$string(s)
					]));
		case 'AddBid':
			return A2($author$project$Ports$encodeType, 'AddBid', _List_Nil);
		default:
			return A2($author$project$Ports$encodeType, 'ResetBids', _List_Nil);
	}
};
var $author$project$Ports$encodeSide = function (side) {
	if (side.$ === 'Left') {
		return $elm$json$Json$Encode$string('left');
	} else {
		return $elm$json$Json$Encode$string('right');
	}
};
var $author$project$Ports$encodeCombatModalMsg = function (msg) {
	switch (msg.$) {
		case 'SelectFaction':
			var side = msg.a;
			var s = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'SelectFaction',
				_List_fromArray(
					[
						$author$project$Ports$encodeSide(side),
						$elm$json$Json$Encode$string(s)
					]));
		case 'SelectWeapon':
			var side = msg.a;
			var s = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'SelectWeapon',
				_List_fromArray(
					[
						$author$project$Ports$encodeSide(side),
						$elm$json$Json$Encode$string(s)
					]));
		case 'SelectDefense':
			var side = msg.a;
			var s = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'SelectDefense',
				_List_fromArray(
					[
						$author$project$Ports$encodeSide(side),
						$elm$json$Json$Encode$string(s)
					]));
		case 'ToggleCheapHero':
			var side = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'ToggleCheapHero',
				_List_fromArray(
					[
						$author$project$Ports$encodeSide(side)
					]));
		case 'ToggleWeaponDiscard':
			var side = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'ToggleWeaponDiscard',
				_List_fromArray(
					[
						$author$project$Ports$encodeSide(side)
					]));
		case 'ToggleDefenseDiscard':
			var side = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'ToggleDefenseDiscard',
				_List_fromArray(
					[
						$author$project$Ports$encodeSide(side)
					]));
		default:
			return A2($author$project$Ports$encodeType, 'ResetCombatModal', _List_Nil);
	}
};
var $author$project$Ports$encodeConfigModalMsg = function (msg) {
	switch (msg.$) {
		case 'ToggleCardShortNames':
			return A2($author$project$Ports$encodeType, 'ToggleCardShortNames', _List_Nil);
		case 'ToggleHandLimits':
			return A2($author$project$Ports$encodeType, 'ToggleHandLimits', _List_Nil);
		default:
			return A2($author$project$Ports$encodeType, 'ToggleDoubleAddToHarkonnen', _List_Nil);
	}
};
var $author$project$Ports$encodeHarkonnenCardSwapModalMsg = function (msg) {
	var target = msg.a;
	return A2(
		$author$project$Ports$encodeType,
		'SelectHarkonnenCardSwapMsg',
		_List_fromArray(
			[
				$elm$json$Json$Encode$string(target)
			]));
};
var $author$project$Ports$encodeModalMsg = function (msg) {
	switch (msg.$) {
		case 'SelectIdentifyCard':
			var s = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'SelectIdentifyCard',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(s)
					]));
		case 'BiddingModalMsg':
			var m = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'BiddingModalMsg',
				_List_fromArray(
					[
						$author$project$Ports$encodeBiddingModalMsg(m)
					]));
		case 'AddCardModalMsg':
			var m = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'AddCardModalMsg',
				_List_fromArray(
					[
						$author$project$Ports$encodeAddCardModalMsg(m)
					]));
		case 'CombatModalMsg':
			var m = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'CombatModalMsg',
				_List_fromArray(
					[
						$author$project$Ports$encodeCombatModalMsg(m)
					]));
		case 'HarkonnenCardSwapModalMsg':
			var m = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'HarkonnenCardSwapModalMsg',
				_List_fromArray(
					[
						$author$project$Ports$encodeHarkonnenCardSwapModalMsg(m)
					]));
		default:
			var m = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'ConfigModalMsg',
				_List_fromArray(
					[
						$author$project$Ports$encodeConfigModalMsg(m)
					]));
	}
};
var $author$project$Ports$encodeGameMsg = function (msg) {
	switch (msg.$) {
		case 'AddCard':
			var card = msg.a;
			var faction = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'AddCard',
				_List_fromArray(
					[
						$author$project$Card$encode(card),
						$author$project$Faction$encode(faction)
					]));
		case 'DiscardCard':
			var card = msg.a;
			var faction = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'DiscardCard',
				_List_fromArray(
					[
						$author$project$Card$encode(card),
						$author$project$Faction$encode(faction)
					]));
		case 'Undo':
			return $elm$json$Json$Encode$null;
		case 'OpenChangeCardModal':
			var faction = msg.a;
			var card = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'OpenChangeCardModal',
				_List_fromArray(
					[
						$author$project$Faction$encode(faction),
						$author$project$Card$encode(card)
					]));
		case 'ChangeCardViaModal':
			var request = msg.a;
			var encodedRequest = $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'faction',
						$author$project$Faction$encode(request.faction)),
						_Utils_Tuple2(
						'current',
						$author$project$Card$encode(request.current)),
						_Utils_Tuple2(
						'new',
						$author$project$Card$encode(request._new))
					]));
			return A2(
				$author$project$Ports$encodeType,
				'ChangeCardViaModal',
				_List_fromArray(
					[encodedRequest]));
		case 'OpenBiddingPhaseModal':
			return A2($author$project$Ports$encodeType, 'OpenBiddingPhaseModal', _List_Nil);
		case 'OpenHistoryModal':
			var m = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'OpenHistoryModal',
				_List_fromArray(
					[
						$author$project$Ports$encodeGameMsg(m)
					]));
		case 'AssignBiddingPhaseCards':
			var assignments = msg.a;
			var encodeAssignment = function (_v1) {
				var card = _v1.a;
				var faction = _v1.b;
				return A2(
					$author$project$Ports$encodeType,
					'tuple',
					_List_fromArray(
						[
							$author$project$Card$encode(card),
							$author$project$Faction$encode(faction)
						]));
			};
			return A2(
				$author$project$Ports$encodeType,
				'AssignBiddingPhaseCards',
				A2($elm$core$List$map, encodeAssignment, assignments));
		case 'ModalMsg':
			var modalMsg = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'ModalMsg',
				_List_fromArray(
					[
						$author$project$Ports$encodeModalMsg(modalMsg)
					]));
		case 'CloseModal':
			return A2($author$project$Ports$encodeType, 'CloseModal', _List_Nil);
		case 'DragDropCardToFaction':
			return $elm$json$Json$Encode$null;
		case 'FinishCombat':
			var left = msg.a;
			var right = msg.b;
			return A2(
				$author$project$Ports$encodeType,
				'FinishCombat',
				_List_fromArray(
					[
						$author$project$Ports$encodeCombatSide(left),
						$author$project$Ports$encodeCombatSide(right)
					]));
		case 'OpenCombatModal':
			return A2($author$project$Ports$encodeType, 'OpenCombatModal', _List_Nil);
		case 'OpenAddCardModal':
			return A2($author$project$Ports$encodeType, 'OpenAddCardModal', _List_Nil);
		case 'OpenConfigModal':
			return A2($author$project$Ports$encodeType, 'OpenConfigModal', _List_Nil);
		case 'FinishConfigModal':
			return A2($author$project$Ports$encodeType, 'FinishConfigModal', _List_Nil);
		case 'OpenHarkonnenCardSwapModal':
			return A2($author$project$Ports$encodeType, 'OpenHarkonnenCardSwapModal', _List_Nil);
		default:
			var target = msg.a;
			return A2(
				$author$project$Ports$encodeType,
				'FinishHarkonnenCardSwap',
				_List_fromArray(
					[
						$author$project$Faction$encode(target)
					]));
	}
};
var $author$project$Ports$encodeAddCardModel = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'card',
				$author$project$Card$encode(model.card)),
				_Utils_Tuple2(
				'faction',
				$author$project$Faction$encode(model.faction))
			]));
};
var $author$project$Ports$encodeChangeCardModal = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'faction',
				$author$project$Faction$encode(model.faction)),
				_Utils_Tuple2(
				'selectedCard',
				$author$project$Card$encode(model.selectedCard)),
				_Utils_Tuple2(
				'clickedCard',
				$author$project$Card$encode(model.clickedCard))
			]));
};
var $author$project$Ports$encodeCombatModel = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'left',
				$author$project$Ports$encodeCombatSide(model.left)),
				_Utils_Tuple2(
				'right',
				$author$project$Ports$encodeCombatSide(model.right))
			]));
};
var $author$project$Ports$encodeHarkonnenCardSwapModel = function (model) {
	return A2(
		$author$project$Ports$encodeType,
		'ModalHarkonnenCardSwapModel',
		_List_fromArray(
			[
				$author$project$Faction$encode(model.target)
			]));
};
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $elm$json$Json$Encode$array = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$Array$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Ports$encodeBid = function (_v0) {
	var card = _v0.a;
	var faction = _v0.b;
	return A2(
		$author$project$Ports$encodeType,
		'tuple',
		_List_fromArray(
			[
				$author$project$Card$encode(card),
				$author$project$Faction$encode(faction)
			]));
};
var $author$project$Ports$encodeModalBiddingModel = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'bids',
				A2($elm$json$Json$Encode$array, $author$project$Ports$encodeBid, model.bids)),
				_Utils_Tuple2(
				'factions',
				A2($elm$json$Json$Encode$list, $author$project$Faction$encode, model.factions))
			]));
};
var $author$project$Ports$encodeModal = function (modal) {
	switch (modal.$) {
		case 'ModalBidding':
			var model = modal.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('ModalBidding')),
						_Utils_Tuple2(
						'value',
						$author$project$Ports$encodeModalBiddingModel(model))
					]));
		case 'ModalChangeCard':
			var model = modal.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('ModalChangeCard')),
						_Utils_Tuple2(
						'value',
						$author$project$Ports$encodeChangeCardModal(model))
					]));
		case 'ModalCombat':
			var model = modal.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('ModalCombat')),
						_Utils_Tuple2(
						'value',
						$author$project$Ports$encodeCombatModel(model))
					]));
		case 'ModalAddCard':
			var model = modal.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('ModalAddCard')),
						_Utils_Tuple2(
						'value',
						$author$project$Ports$encodeAddCardModel(model))
					]));
		case 'ModalConfig':
			var model = modal.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('ModalConfig')),
						_Utils_Tuple2(
						'value',
						$author$project$Ports$encodeConfig(model))
					]));
		case 'ModalHistory':
			var model = modal.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('ModalHistory')),
						_Utils_Tuple2(
						'value',
						$author$project$Ports$encodeGameMsg(model))
					]));
		default:
			var model = modal.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string('ModalHarkonnenCardSwap')),
						_Utils_Tuple2(
						'value',
						$author$project$Ports$encodeHarkonnenCardSwapModel(model))
					]));
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Ports$encodeGame = function (game) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'players',
				A2($elm$json$Json$Encode$list, $author$project$Ports$playerBicoder.encode, game.players)),
				_Utils_Tuple2(
				'history',
				A2($elm$json$Json$Encode$list, $author$project$Ports$encodeGameMsg, game.history)),
				_Utils_Tuple2(
				'modal',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Ports$encodeModal, game.modal))),
				_Utils_Tuple2(
				'savedBiddingPhaseModalModel',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Ports$encodeModalBiddingModel, game.savedBiddingPhaseModalModel))),
				_Utils_Tuple2(
				'savedCombatModalModel',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Ports$encodeCombatModalModel, game.savedCombatModalModel))),
				_Utils_Tuple2(
				'config',
				$author$project$Ports$encodeConfig(game.config))
			]));
};
var $author$project$Ports$saveGame = function (game) {
	return $author$project$Ports$saveState(
		$author$project$Ports$encodeGame(game));
};
var $author$project$View$History$supportsModal = function (msg) {
	switch (msg.$) {
		case 'AssignBiddingPhaseCards':
			return true;
		case 'FinishCombat':
			return true;
		default:
			return false;
	}
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver = F4(
	function (a, b, c, d) {
		return {$: 'DraggedOver', a: a, b: b, c: c, d: d};
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$Dragging = function (a) {
	return {$: 'Dragging', a: a};
};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$updateCommon = F3(
	function (sticky, msg, model) {
		var _v0 = _Utils_Tuple3(msg, model, sticky);
		_v0$9:
		while (true) {
			switch (_v0.a.$) {
				case 'DragStart':
					var _v1 = _v0.a;
					var dragId = _v1.a;
					return _Utils_Tuple2(
						$norpan$elm_html5_drag_drop$Html5$DragDrop$Dragging(dragId),
						$elm$core$Maybe$Nothing);
				case 'DragEnd':
					var _v2 = _v0.a;
					return _Utils_Tuple2($norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging, $elm$core$Maybe$Nothing);
				case 'DragEnter':
					switch (_v0.b.$) {
						case 'Dragging':
							var dropId = _v0.a.a;
							var dragId = _v0.b.a;
							return _Utils_Tuple2(
								A4($norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver, dragId, dropId, 0, $elm$core$Maybe$Nothing),
								$elm$core$Maybe$Nothing);
						case 'DraggedOver':
							var dropId = _v0.a.a;
							var _v3 = _v0.b;
							var dragId = _v3.a;
							var pos = _v3.d;
							return _Utils_Tuple2(
								A4($norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver, dragId, dropId, 0, pos),
								$elm$core$Maybe$Nothing);
						default:
							break _v0$9;
					}
				case 'DragLeave':
					if ((_v0.b.$ === 'DraggedOver') && (!_v0.c)) {
						var dropId_ = _v0.a.a;
						var _v4 = _v0.b;
						var dragId = _v4.a;
						var dropId = _v4.b;
						return _Utils_eq(dropId_, dropId) ? _Utils_Tuple2(
							$norpan$elm_html5_drag_drop$Html5$DragDrop$Dragging(dragId),
							$elm$core$Maybe$Nothing) : _Utils_Tuple2(model, $elm$core$Maybe$Nothing);
					} else {
						break _v0$9;
					}
				case 'DragOver':
					switch (_v0.b.$) {
						case 'Dragging':
							var _v5 = _v0.a;
							var dropId = _v5.a;
							var timeStamp = _v5.b;
							var pos = _v5.c;
							var dragId = _v0.b.a;
							return _Utils_Tuple2(
								A4(
									$norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver,
									dragId,
									dropId,
									timeStamp,
									$elm$core$Maybe$Just(pos)),
								$elm$core$Maybe$Nothing);
						case 'DraggedOver':
							var _v6 = _v0.a;
							var dropId = _v6.a;
							var timeStamp = _v6.b;
							var pos = _v6.c;
							var _v7 = _v0.b;
							var dragId = _v7.a;
							var currentDropId = _v7.b;
							var currentTimeStamp = _v7.c;
							var currentPos = _v7.d;
							return _Utils_eq(timeStamp, currentTimeStamp) ? _Utils_Tuple2(model, $elm$core$Maybe$Nothing) : _Utils_Tuple2(
								A4(
									$norpan$elm_html5_drag_drop$Html5$DragDrop$DraggedOver,
									dragId,
									dropId,
									timeStamp,
									$elm$core$Maybe$Just(pos)),
								$elm$core$Maybe$Nothing);
						default:
							break _v0$9;
					}
				default:
					switch (_v0.b.$) {
						case 'Dragging':
							var _v8 = _v0.a;
							var dropId = _v8.a;
							var pos = _v8.b;
							var dragId = _v0.b.a;
							return _Utils_Tuple2(
								$norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging,
								$elm$core$Maybe$Just(
									_Utils_Tuple3(dragId, dropId, pos)));
						case 'DraggedOver':
							var _v9 = _v0.a;
							var dropId = _v9.a;
							var pos = _v9.b;
							var _v10 = _v0.b;
							var dragId = _v10.a;
							return _Utils_Tuple2(
								$norpan$elm_html5_drag_drop$Html5$DragDrop$NotDragging,
								$elm$core$Maybe$Just(
									_Utils_Tuple3(dragId, dropId, pos)));
						default:
							break _v0$9;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Maybe$Nothing);
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$update = $norpan$elm_html5_drag_drop$Html5$DragDrop$updateCommon(false);
var $author$project$Modal$AddCard$update = F2(
	function (msg, model) {
		if (msg.$ === 'SelectAddCardCard') {
			var cardString = msg.a;
			var _v1 = $author$project$Card$fromString(cardString);
			if (_v1.$ === 'Just') {
				var c = _v1.a;
				return _Utils_update(
					model,
					{card: c});
			} else {
				return model;
			}
		} else {
			var factionString = msg.a;
			var _v2 = $author$project$Faction$fromString(factionString);
			if (_v2.$ === 'Just') {
				var f = _v2.a;
				return _Utils_update(
					model,
					{faction: f});
			} else {
				return model;
			}
		}
	});
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$Modal$Bidding$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'AddBid':
				return _Utils_update(
					model,
					{
						bids: A2(
							$elm$core$Array$push,
							_Utils_Tuple2($author$project$Card$unknown, $author$project$Faction$unknown),
							model.bids)
					});
			case 'ResetBids':
				return _Utils_update(
					model,
					{
						bids: A2(
							$elm$core$Array$push,
							_Utils_Tuple2($author$project$Card$unknown, $author$project$Faction$unknown),
							$elm$core$Array$empty)
					});
			case 'SelectBiddingCard':
				var index = msg.a;
				var cardString = msg.b;
				var updateBid = function (card) {
					var _v1 = A2($elm$core$Array$get, index, model.bids);
					if (_v1.$ === 'Nothing') {
						return model;
					} else {
						var _v2 = _v1.a;
						var faction = _v2.b;
						return _Utils_update(
							model,
							{
								bids: A3(
									$elm$core$Array$set,
									index,
									_Utils_Tuple2(card, faction),
									model.bids)
							});
					}
				};
				var maybeUpdated = A2(
					$elm$core$Maybe$map,
					updateBid,
					$author$project$Card$fromString(cardString));
				return A2($elm$core$Maybe$withDefault, model, maybeUpdated);
			default:
				var index = msg.a;
				var factionString = msg.b;
				var updateBid = function (faction) {
					var _v3 = A2($elm$core$Array$get, index, model.bids);
					if (_v3.$ === 'Nothing') {
						return model;
					} else {
						var _v4 = _v3.a;
						var card = _v4.a;
						return _Utils_update(
							model,
							{
								bids: A3(
									$elm$core$Array$set,
									index,
									_Utils_Tuple2(card, faction),
									model.bids)
							});
					}
				};
				var maybeUpdated = A2(
					$elm$core$Maybe$map,
					updateBid,
					$author$project$Faction$fromString(factionString));
				return A2($elm$core$Maybe$withDefault, model, maybeUpdated);
		}
	});
var $arturopala$elm_monocle$Monocle$Lens$Lens = F2(
	function (get, set) {
		return {get: get, set: set};
	});
var $author$project$Modal$Combat$selectLeftSide = A2(
	$arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.left;
	},
	F2(
		function (b, a) {
			return _Utils_update(
				a,
				{left: b});
		}));
var $author$project$Modal$Combat$selectRightSide = A2(
	$arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.right;
	},
	F2(
		function (b, a) {
			return _Utils_update(
				a,
				{right: b});
		}));
var $author$project$Modal$Combat$chooseSideLens = function (side) {
	if (side.$ === 'Left') {
		return $author$project$Modal$Combat$selectLeftSide;
	} else {
		return $author$project$Modal$Combat$selectRightSide;
	}
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $arturopala$elm_monocle$Monocle$Lens$compose = F2(
	function (outer, inner) {
		var set = F2(
			function (c, a) {
				return function (b) {
					return A2(outer.set, b, a);
				}(
					A2(
						inner.set,
						c,
						outer.get(a)));
			});
		return A2(
			$arturopala$elm_monocle$Monocle$Lens$Lens,
			A2($elm$core$Basics$composeR, outer.get, inner.get),
			set);
	});
var $arturopala$elm_monocle$Monocle$Lens$modify = F2(
	function (lens, f) {
		var mf = function (a) {
			return function (b) {
				return A2(lens.set, b, a);
			}(
				f(
					lens.get(a)));
		};
		return mf;
	});
var $author$project$Modal$Combat$sideCheapHero = A2(
	$arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.cheapHero;
	},
	F2(
		function (b, a) {
			return _Utils_update(
				a,
				{cheapHero: b});
		}));
var $author$project$Modal$Combat$sideDefense = A2(
	$arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.defense;
	},
	F2(
		function (b, a) {
			return _Utils_update(
				a,
				{defense: b});
		}));
var $author$project$Modal$Combat$sideFaction = A2(
	$arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.faction;
	},
	F2(
		function (b, a) {
			return _Utils_update(
				a,
				{faction: b});
		}));
var $author$project$Modal$Combat$sideWeapon = A2(
	$arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.weapon;
	},
	F2(
		function (b, a) {
			return _Utils_update(
				a,
				{weapon: b});
		}));
var $author$project$Modal$Combat$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SelectFaction':
				var side = msg.a;
				var faction = msg.b;
				var _v1 = $author$project$Faction$fromString(faction);
				if (_v1.$ === 'Just') {
					var f = _v1.a;
					var sideLens = $author$project$Modal$Combat$chooseSideLens(side);
					return A3(
						$arturopala$elm_monocle$Monocle$Lens$modify,
						A2($arturopala$elm_monocle$Monocle$Lens$compose, sideLens, $author$project$Modal$Combat$sideFaction),
						function (_v2) {
							return f;
						},
						model);
				} else {
					return model;
				}
			case 'ResetCombatModal':
				return $author$project$Modal$Combat$init;
			case 'SelectWeapon':
				var side = msg.a;
				var card = msg.b;
				var _v3 = $author$project$Card$fromString(card);
				if (_v3.$ === 'Just') {
					var c = _v3.a;
					var sideLens = $author$project$Modal$Combat$chooseSideLens(side);
					var discardStatus = A2($author$project$Card$eq, $author$project$Card$useless, c);
					return A3(
						$arturopala$elm_monocle$Monocle$Lens$modify,
						A2($arturopala$elm_monocle$Monocle$Lens$compose, sideLens, $author$project$Modal$Combat$sideWeapon),
						function (cc) {
							return _Utils_update(
								cc,
								{card: c, discard: discardStatus});
						},
						model);
				} else {
					return model;
				}
			case 'SelectDefense':
				var side = msg.a;
				var card = msg.b;
				var _v4 = $author$project$Card$fromString(card);
				if (_v4.$ === 'Just') {
					var c = _v4.a;
					var sideLens = $author$project$Modal$Combat$chooseSideLens(side);
					var discardStatus = A2($author$project$Card$eq, $author$project$Card$useless, c);
					return A3(
						$arturopala$elm_monocle$Monocle$Lens$modify,
						A2($arturopala$elm_monocle$Monocle$Lens$compose, sideLens, $author$project$Modal$Combat$sideDefense),
						function (cc) {
							return _Utils_update(
								cc,
								{card: c, discard: discardStatus});
						},
						model);
				} else {
					return model;
				}
			case 'ToggleWeaponDiscard':
				var side = msg.a;
				var sideLens = $author$project$Modal$Combat$chooseSideLens(side);
				return A3(
					$arturopala$elm_monocle$Monocle$Lens$modify,
					A2($arturopala$elm_monocle$Monocle$Lens$compose, sideLens, $author$project$Modal$Combat$sideWeapon),
					function (cc) {
						return _Utils_update(
							cc,
							{discard: !cc.discard});
					},
					model);
			case 'ToggleDefenseDiscard':
				var side = msg.a;
				var sideLens = $author$project$Modal$Combat$chooseSideLens(side);
				return A3(
					$arturopala$elm_monocle$Monocle$Lens$modify,
					A2($arturopala$elm_monocle$Monocle$Lens$compose, sideLens, $author$project$Modal$Combat$sideDefense),
					function (cc) {
						return _Utils_update(
							cc,
							{discard: !cc.discard});
					},
					model);
			default:
				var side = msg.a;
				var sideLens = $author$project$Modal$Combat$chooseSideLens(side);
				return A3(
					$arturopala$elm_monocle$Monocle$Lens$modify,
					A2($arturopala$elm_monocle$Monocle$Lens$compose, sideLens, $author$project$Modal$Combat$sideCheapHero),
					$elm$core$Basics$not,
					model);
		}
	});
var $author$project$Modal$Config$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'ToggleCardShortNames':
				return _Utils_update(
					model,
					{cardShortNames: !model.cardShortNames});
			case 'ToggleHandLimits':
				return _Utils_update(
					model,
					{handLimits: !model.handLimits});
			default:
				return _Utils_update(
					model,
					{doubleAddToHarkonnen: !model.doubleAddToHarkonnen});
		}
	});
var $author$project$Modal$HarkonnenCardSwap$update = F2(
	function (msg, model) {
		var factionString = msg.a;
		var _v1 = $author$project$Faction$fromString(factionString);
		if (_v1.$ === 'Nothing') {
			return model;
		} else {
			var faction = _v1.a;
			return _Utils_update(
				model,
				{target: faction});
		}
	});
var $author$project$Main$updateModal = F2(
	function (msg, modalModel) {
		var _v0 = _Utils_Tuple2(msg, modalModel);
		_v0$6:
		while (true) {
			switch (_v0.a.$) {
				case 'CombatModalMsg':
					if (_v0.b.$ === 'ModalCombat') {
						var combatMsg = _v0.a.a;
						var model = _v0.b.a;
						return $author$project$Types$ModalCombat(
							A2($author$project$Modal$Combat$update, combatMsg, model));
					} else {
						break _v0$6;
					}
				case 'HarkonnenCardSwapModalMsg':
					if (_v0.b.$ === 'ModalHarkonnenCardSwap') {
						var cardSwapMsg = _v0.a.a;
						var model = _v0.b.a;
						return $author$project$Types$ModalHarkonnenCardSwap(
							A2($author$project$Modal$HarkonnenCardSwap$update, cardSwapMsg, model));
					} else {
						break _v0$6;
					}
				case 'SelectIdentifyCard':
					if (_v0.b.$ === 'ModalChangeCard') {
						var cardString = _v0.a.a;
						var model = _v0.b.a;
						var _v1 = $author$project$Card$fromString(cardString);
						if (_v1.$ === 'Nothing') {
							return modalModel;
						} else {
							var card = _v1.a;
							return $author$project$Types$ModalChangeCard(
								_Utils_update(
									model,
									{selectedCard: card}));
						}
					} else {
						break _v0$6;
					}
				case 'BiddingModalMsg':
					if (_v0.b.$ === 'ModalBidding') {
						var biddingMsg = _v0.a.a;
						var model = _v0.b.a;
						return $author$project$Types$ModalBidding(
							A2($author$project$Modal$Bidding$update, biddingMsg, model));
					} else {
						break _v0$6;
					}
				case 'AddCardModalMsg':
					if (_v0.b.$ === 'ModalAddCard') {
						var addCardMsg = _v0.a.a;
						var model = _v0.b.a;
						return $author$project$Types$ModalAddCard(
							A2($author$project$Modal$AddCard$update, addCardMsg, model));
					} else {
						break _v0$6;
					}
				default:
					if (_v0.b.$ === 'ModalConfig') {
						var configMsg = _v0.a.a;
						var model = _v0.b.a;
						return $author$project$Types$ModalConfig(
							A2($author$project$Modal$Config$update, configMsg, model));
					} else {
						break _v0$6;
					}
			}
		}
		return modalModel;
	});
var $author$project$Main$withHistory = F2(
	function (msg, model) {
		return _Utils_update(
			model,
			{
				history: A2($elm$core$List$cons, msg, model.history)
			});
	});
var $author$project$Main$popHistory = function (game) {
	var tailHistory = A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		$elm$core$List$tail(game.history));
	var folder = F2(
		function (msg, model) {
			var _v13 = A2($author$project$Main$updateGame, msg, model);
			var updatedModel = _v13.a;
			if (updatedModel.$ === 'ViewGame') {
				var g = updatedModel.a;
				return g;
			} else {
				return model;
			}
		});
	var updatedGame = A3(
		$elm$core$List$foldl,
		folder,
		$author$project$Main$createGame(
			A2(
				$elm$core$List$map,
				function (player) {
					return player.faction;
				},
				game.players)),
		$elm$core$List$reverse(tailHistory));
	return _Utils_update(
		updatedGame,
		{history: tailHistory});
};
var $author$project$Main$updateGame = F2(
	function (msg, game) {
		var _v0 = function () {
			switch (msg.$) {
				case 'Undo':
					return _Utils_Tuple2(
						$author$project$Main$popHistory(game),
						true);
				case 'OpenHistoryModal':
					var m = msg.a;
					return $author$project$View$History$supportsModal(m) ? _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$OpenHistoryModal(m),
							_Utils_update(
								game,
								{
									modal: $elm$core$Maybe$Just(
										$author$project$Types$ModalHistory(m))
								})),
						true) : _Utils_Tuple2(game, false);
				case 'FinishHarkonnenCardSwap':
					var target = msg.a;
					var unknownify = function (player) {
						return (A2($author$project$Faction$eq, $author$project$Faction$harkonnen, player.faction) || A2($author$project$Faction$eq, target, player.faction)) ? _Utils_update(
							player,
							{
								hand: A2(
									$elm$core$List$map,
									function (_v2) {
										return $author$project$Card$unknown;
									},
									player.hand)
							}) : player;
					};
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$FinishHarkonnenCardSwap(target),
							_Utils_update(
								game,
								{
									modal: $elm$core$Maybe$Nothing,
									players: A2($elm$core$List$map, unknownify, game.players)
								})),
						true);
				case 'OpenHarkonnenCardSwapModal':
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$OpenHarkonnenCardSwapModal,
							_Utils_update(
								game,
								{
									modal: $elm$core$Maybe$Just(
										$author$project$Types$ModalHarkonnenCardSwap(
											{target: $author$project$Faction$unknown}))
								})),
						true);
				case 'AddCard':
					var card = msg.a;
					var faction = msg.b;
					var updatedModal = function () {
						var _v3 = game.modal;
						if ((_v3.$ === 'Just') && (_v3.a.$ === 'ModalAddCard')) {
							var m = _v3.a.a;
							return $elm$core$Maybe$Nothing;
						} else {
							var x = _v3;
							return x;
						}
					}();
					var updatedGame = _Utils_update(
						game,
						{
							modal: updatedModal,
							players: A4($author$project$Main$addCardToPlayer, game.config, card, faction, game.players)
						});
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							A2($author$project$Types$AddCard, card, faction),
							updatedGame),
						true);
				case 'DiscardCard':
					var card = msg.a;
					var faction = msg.b;
					var updatedPlayers = A3(
						$author$project$Main$updateFaction,
						function (player) {
							return _Utils_update(
								player,
								{
									hand: A2($author$project$Main$removeFirst, card, player.hand)
								});
						},
						faction,
						game.players);
					var updatedGame = _Utils_update(
						game,
						{players: updatedPlayers});
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							A2($author$project$Types$DiscardCard, card, faction),
							updatedGame),
						true);
				case 'DragDropCardToFaction':
					var msg_ = msg.a;
					var _v4 = A2($norpan$elm_html5_drag_drop$Html5$DragDrop$update, msg_, game.dragDrop);
					var model_ = _v4.a;
					var result = _v4.b;
					if (result.$ === 'Nothing') {
						return _Utils_Tuple2(
							_Utils_update(
								game,
								{dragDrop: model_}),
							false);
					} else {
						var _v6 = result.a;
						var card = _v6.a;
						var faction = _v6.b;
						var updatedPlayers = A4($author$project$Main$addCardToPlayer, game.config, card, faction, game.players);
						return _Utils_Tuple2(
							A2(
								$author$project$Main$withHistory,
								A2($author$project$Types$AddCard, card, faction),
								_Utils_update(
									game,
									{dragDrop: model_, players: updatedPlayers})),
							true);
					}
				case 'OpenBiddingPhaseModal':
					var initialState = function () {
						var _v7 = game.savedBiddingPhaseModalModel;
						if (_v7.$ === 'Nothing') {
							return {
								bids: A2(
									$elm$core$Array$push,
									_Utils_Tuple2($author$project$Card$unknown, $author$project$Faction$unknown),
									$elm$core$Array$empty),
								factions: A2(
									$elm$core$List$map,
									function (player) {
										return player.faction;
									},
									game.players)
							};
						} else {
							var saved = _v7.a;
							return saved;
						}
					}();
					var biddingModal = $author$project$Types$ModalBidding(initialState);
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$OpenBiddingPhaseModal,
							_Utils_update(
								game,
								{
									modal: $elm$core$Maybe$Just(biddingModal)
								})),
						true);
				case 'OpenAddCardModal':
					var initialState = {card: $author$project$Card$unknown, faction: $author$project$Faction$unknown};
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$OpenAddCardModal,
							_Utils_update(
								game,
								{
									modal: $elm$core$Maybe$Just(
										$author$project$Types$ModalAddCard(initialState))
								})),
						true);
				case 'OpenCombatModal':
					var initialState = function () {
						var _v8 = game.savedCombatModalModel;
						if (_v8.$ === 'Nothing') {
							return $author$project$Modal$Combat$init;
						} else {
							var previous = _v8.a;
							return previous;
						}
					}();
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$OpenCombatModal,
							_Utils_update(
								game,
								{
									modal: $elm$core$Maybe$Just(
										$author$project$Types$ModalCombat(initialState))
								})),
						true);
				case 'OpenChangeCardModal':
					var faction = msg.a;
					var card = msg.b;
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							A2($author$project$Types$OpenChangeCardModal, faction, card),
							_Utils_update(
								game,
								{
									modal: $elm$core$Maybe$Just(
										$author$project$Types$ModalChangeCard(
											{clickedCard: card, faction: faction, selectedCard: card}))
								})),
						true);
				case 'ChangeCardViaModal':
					var changeRequest = msg.a;
					var updatedPlayers = A3(
						$author$project$Main$updateFaction,
						function (player) {
							return _Utils_update(
								player,
								{
									hand: A3($author$project$Main$changeCard, changeRequest.current, changeRequest._new, player.hand)
								});
						},
						changeRequest.faction,
						game.players);
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$ChangeCardViaModal(changeRequest),
							_Utils_update(
								game,
								{modal: $elm$core$Maybe$Nothing, players: updatedPlayers})),
						true);
				case 'FinishCombat':
					var leftSide = msg.a;
					var rightSide = msg.b;
					var updateWithCard = F2(
						function (card, cards) {
							return A2(
								$elm$core$List$any,
								function (c) {
									return A2($author$project$Card$eq, card, c);
								},
								cards) ? cards : A2($author$project$Main$replaceOrInsert, card, cards);
						});
					var updateWithCombatCard = F2(
						function (combatCard, cards) {
							return combatCard.discard ? A2($elm_community$list_extra$List$Extra$remove, combatCard.card, cards) : A2(updateWithCard, combatCard.card, cards);
						});
					var updatePlayer = F3(
						function (cards, faction, game_) {
							return _Utils_update(
								game,
								{
									players: A3(
										$author$project$Main$updateFaction,
										function (p) {
											return _Utils_update(
												p,
												{
													hand: A3(
														$elm$core$List$foldl,
														F2(
															function (current, acc) {
																return A2(updateWithCombatCard, current, acc);
															}),
														p.hand,
														cards)
												});
										},
										faction,
										game_.players)
								});
						});
					var rightFaction = rightSide.faction;
					var rightCards = A2(
						$elm$core$List$filter,
						function (c) {
							return !A2($author$project$Card$eq, c.card, $author$project$Card$none);
						},
						rightSide.cheapHero ? _List_fromArray(
							[
								rightSide.weapon,
								rightSide.defense,
								{card: $author$project$Card$cheapHero, discard: true}
							]) : _List_fromArray(
							[rightSide.weapon, rightSide.defense]));
					var leftFaction = leftSide.faction;
					var leftCards = A2(
						$elm$core$List$filter,
						function (c) {
							return !A2($author$project$Card$eq, c.card, $author$project$Card$none);
						},
						leftSide.cheapHero ? _List_fromArray(
							[
								leftSide.weapon,
								leftSide.defense,
								{card: $author$project$Card$cheapHero, discard: true}
							]) : _List_fromArray(
							[leftSide.weapon, leftSide.defense]));
					var updatedGame = A3(
						updatePlayer,
						rightCards,
						rightFaction,
						A3(updatePlayer, leftCards, leftFaction, game));
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							A2($author$project$Types$FinishCombat, leftSide, rightSide),
							_Utils_update(
								updatedGame,
								{modal: $elm$core$Maybe$Nothing, savedCombatModalModel: $elm$core$Maybe$Nothing})),
						true);
				case 'AssignBiddingPhaseCards':
					var cards = msg.a;
					var assignCard = F2(
						function (entry, players) {
							var card = entry.a;
							var faction = entry.b;
							return (A2($author$project$Faction$eq, $author$project$Faction$harkonnen, faction) && game.config.doubleAddToHarkonnen) ? A4(
								$author$project$Main$addCardToPlayer,
								game.config,
								$author$project$Card$unknown,
								faction,
								A4($author$project$Main$addCardToPlayer, game.config, card, faction, players)) : A4($author$project$Main$addCardToPlayer, game.config, card, faction, players);
						});
					var updatedPlayers = A3($elm$core$List$foldl, assignCard, game.players, cards);
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$AssignBiddingPhaseCards(cards),
							_Utils_update(
								game,
								{modal: $elm$core$Maybe$Nothing, players: updatedPlayers, savedBiddingPhaseModalModel: $elm$core$Maybe$Nothing})),
						true);
				case 'OpenConfigModal':
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$OpenConfigModal,
							_Utils_update(
								game,
								{
									modal: $elm$core$Maybe$Just(
										$author$project$Types$ModalConfig(game.config))
								})),
						true);
				case 'FinishConfigModal':
					var _v10 = game.modal;
					if ((_v10.$ === 'Just') && (_v10.a.$ === 'ModalConfig')) {
						var config = _v10.a.a;
						return _Utils_Tuple2(
							A2(
								$author$project$Main$withHistory,
								$author$project$Types$FinishConfigModal,
								_Utils_update(
									game,
									{config: config, modal: $elm$core$Maybe$Nothing})),
							true);
					} else {
						return _Utils_Tuple2(game, false);
					}
				case 'CloseModal':
					var _v11 = game.modal;
					_v11$2:
					while (true) {
						if (_v11.$ === 'Just') {
							switch (_v11.a.$) {
								case 'ModalBidding':
									var biddingModel = _v11.a.a;
									return _Utils_Tuple2(
										A2(
											$author$project$Main$withHistory,
											$author$project$Types$CloseModal,
											_Utils_update(
												game,
												{
													modal: $elm$core$Maybe$Nothing,
													savedBiddingPhaseModalModel: $elm$core$Maybe$Just(biddingModel)
												})),
										true);
								case 'ModalCombat':
									var combatModel = _v11.a.a;
									return _Utils_Tuple2(
										A2(
											$author$project$Main$withHistory,
											$author$project$Types$CloseModal,
											_Utils_update(
												game,
												{
													modal: $elm$core$Maybe$Nothing,
													savedCombatModalModel: $elm$core$Maybe$Just(combatModel)
												})),
										true);
								default:
									break _v11$2;
							}
						} else {
							break _v11$2;
						}
					}
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$CloseModal,
							_Utils_update(
								game,
								{modal: $elm$core$Maybe$Nothing})),
						true);
				default:
					var modalMsg = msg.a;
					var newModalModel = function () {
						var _v12 = game.modal;
						if (_v12.$ === 'Nothing') {
							return $elm$core$Maybe$Nothing;
						} else {
							var modalModel = _v12.a;
							return $elm$core$Maybe$Just(
								A2($author$project$Main$updateModal, modalMsg, modalModel));
						}
					}();
					return _Utils_Tuple2(
						A2(
							$author$project$Main$withHistory,
							$author$project$Types$ModalMsg(modalMsg),
							_Utils_update(
								game,
								{modal: newModalModel})),
						true);
			}
		}();
		var updatedModel = _v0.a;
		var changed = _v0.b;
		var cmd = changed ? $author$project$Ports$saveGame(updatedModel) : $elm$core$Platform$Cmd$none;
		return _Utils_Tuple2(
			$author$project$Types$ViewGame(updatedModel),
			cmd);
	});
var $pzp1997$assoc_list$AssocList$get = F2(
	function (targetKey, _v0) {
		get:
		while (true) {
			var alist = _v0.a;
			if (!alist.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v2 = alist.a;
				var key = _v2.a;
				var value = _v2.b;
				var rest = alist.b;
				if (_Utils_eq(key, targetKey)) {
					return $elm$core$Maybe$Just(value);
				} else {
					var $temp$targetKey = targetKey,
						$temp$_v0 = $pzp1997$assoc_list$AssocList$D(rest);
					targetKey = $temp$targetKey;
					_v0 = $temp$_v0;
					continue get;
				}
			}
		}
	});
var $pzp1997$assoc_list$AssocList$update = F3(
	function (targetKey, alter, dict) {
		var alist = dict.a;
		var maybeValue = A2($pzp1997$assoc_list$AssocList$get, targetKey, dict);
		if (maybeValue.$ === 'Just') {
			var _v1 = alter(maybeValue);
			if (_v1.$ === 'Just') {
				var alteredValue = _v1.a;
				return $pzp1997$assoc_list$AssocList$D(
					A2(
						$elm$core$List$map,
						function (entry) {
							var key = entry.a;
							return _Utils_eq(key, targetKey) ? _Utils_Tuple2(targetKey, alteredValue) : entry;
						},
						alist));
			} else {
				return A2($pzp1997$assoc_list$AssocList$remove, targetKey, dict);
			}
		} else {
			var _v2 = alter($elm$core$Maybe$Nothing);
			if (_v2.$ === 'Just') {
				var alteredValue = _v2.a;
				return $pzp1997$assoc_list$AssocList$D(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(targetKey, alteredValue),
						alist));
			} else {
				return dict;
			}
		}
	});
var $author$project$Main$withNoCommand = function (model) {
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $author$project$Main$updateSetup = F3(
	function (msg, parentModel, model) {
		if (msg.$ === 'CreateGame') {
			var factions = msg.a;
			var _v1 = $author$project$Main$withNoCommand(
				$author$project$Types$ViewGame(
					$author$project$Main$createGame(
						A2($elm$core$List$cons, $author$project$Faction$atreides, factions))));
			var newModel = _v1.a;
			var cmd = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					parentModel,
					{page: newModel}),
				cmd);
		} else {
			var faction = msg.a;
			var updatedDict = A3(
				$pzp1997$assoc_list$AssocList$update,
				faction,
				function (v) {
					return A2($elm$core$Maybe$map, $elm$core$Basics$not, v);
				},
				model.factions);
			var _v2 = $author$project$Main$withNoCommand(
				$author$project$Types$ViewSetup(
					{factions: updatedDict}));
			var newModel = _v2.a;
			var cmd = _v2.b;
			return _Utils_Tuple2(
				_Utils_update(
					parentModel,
					{page: newModel}),
				cmd);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model.page);
		_v0$4:
		while (true) {
			switch (_v0.a.$) {
				case 'ViewGameMsg':
					if (_v0.b.$ === 'ViewGame') {
						var gameMsg = _v0.a.a;
						var game = _v0.b.a;
						var _v1 = A2($author$project$Main$updateGame, gameMsg, game);
						var updatedGame = _v1.a;
						var cmd = _v1.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{page: updatedGame}),
							cmd);
					} else {
						break _v0$4;
					}
				case 'ResetGame':
					if (_v0.b.$ === 'ViewGame') {
						var _v2 = _v0.a;
						var game = _v0.b.a;
						return $author$project$Main$initSetup(_Utils_Tuple0);
					} else {
						break _v0$4;
					}
				case 'ViewSetupMsg':
					if (_v0.b.$ === 'ViewSetup') {
						var setupMsg = _v0.a.a;
						var state = _v0.b.a;
						return A3($author$project$Main$updateSetup, setupMsg, model, state);
					} else {
						break _v0$4;
					}
				default:
					var _v3 = _v0.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{navbarExpanded: !model.navbarExpanded}),
						$elm$core$Platform$Cmd$none);
			}
		}
		var _v4 = A2(
			$elm$core$Debug$log,
			'Unmatched msg',
			_Utils_Tuple2(msg, model));
		return $author$project$Main$withNoCommand(model);
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $ahstro$elm_bulma_classes$Bulma$Classes$content = 'content';
var $elm$html$Html$div = _VirtualDom_node('div');
var $ahstro$elm_bulma_classes$Bulma$Classes$footer = 'footer';
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $ahstro$elm_bulma_classes$Bulma$Classes$hasTextCentered = 'has-text-centered';
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$viewFooter = function () {
	var inspiration = 'https://github.com/ohgoditspotato/atreides_mentat';
	return A2(
		$elm$html$Html$footer,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$footer)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$content),
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$hasTextCentered)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Heavily inspired by '),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(inspiration)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(inspiration)
									]))
							]))
					]))
			]));
}();
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $elm$html$Html$Lazy$lazy2 = $elm$virtual_dom$VirtualDom$lazy2;
var $ahstro$elm_bulma_classes$Bulma$Classes$column = 'column';
var $ahstro$elm_bulma_classes$Bulma$Classes$columns = 'columns';
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $ahstro$elm_bulma_classes$Bulma$Classes$isAncestor = 'is-ancestor';
var $ahstro$elm_bulma_classes$Bulma$Classes$isCentered = 'is-centered';
var $ahstro$elm_bulma_classes$Bulma$Classes$isChild = 'is-child';
var $ahstro$elm_bulma_classes$Bulma$Classes$isNarrow = 'is-narrow';
var $ahstro$elm_bulma_classes$Bulma$Classes$isParent = 'is-parent';
var $ahstro$elm_bulma_classes$Bulma$Classes$section = 'section';
var $ahstro$elm_bulma_classes$Bulma$Classes$tile = 'tile';
var $ahstro$elm_bulma_classes$Bulma$Classes$title = 'title';
var $author$project$Types$ViewGameMsg = function (a) {
	return {$: 'ViewGameMsg', a: a};
};
var $ahstro$elm_bulma_classes$Bulma$Classes$box = 'box';
var $author$project$Card$defenses = _List_fromArray(
	[$author$project$Card$defensePoison, $author$project$Card$defenseProjectile]);
var $ahstro$elm_bulma_classes$Bulma$Classes$isBlack = 'is-black';
var $ahstro$elm_bulma_classes$Bulma$Classes$isDanger = 'is-danger';
var $ahstro$elm_bulma_classes$Bulma$Classes$isInfo = 'is-info';
var $ahstro$elm_bulma_classes$Bulma$Classes$isSuccess = 'is-success';
var $ahstro$elm_bulma_classes$Bulma$Classes$isWarning = 'is-warning';
var $author$project$Card$special = _List_fromArray(
	[$author$project$Card$cheapHero, $author$project$Card$familyAtomics, $author$project$Card$hajr, $author$project$Card$karama, $author$project$Card$ghola, $author$project$Card$truthTrance, $author$project$Card$weatherControl]);
var $author$project$Card$weapons = _List_fromArray(
	[$author$project$Card$weaponPoison, $author$project$Card$weaponProjectile, $author$project$Card$weaponLasgun]);
var $author$project$Card$bulmaClass = function (card) {
	var containsCard = function (list) {
		return A2(
			$elm$core$List$any,
			$author$project$Card$eq(card),
			list);
	};
	return containsCard($author$project$Card$weapons) ? $ahstro$elm_bulma_classes$Bulma$Classes$isDanger : (containsCard($author$project$Card$defenses) ? $ahstro$elm_bulma_classes$Bulma$Classes$isInfo : (containsCard($author$project$Card$special) ? $ahstro$elm_bulma_classes$Bulma$Classes$isSuccess : (A2($author$project$Card$eq, $author$project$Card$useless, card) ? $ahstro$elm_bulma_classes$Bulma$Classes$isWarning : (A2($author$project$Card$eq, $author$project$Card$unknown, card) ? $ahstro$elm_bulma_classes$Bulma$Classes$isBlack : ''))));
};
var $ahstro$elm_bulma_classes$Bulma$Classes$isMedium = 'is-medium';
var $elm$html$Html$span = _VirtualDom_node('span');
var $ahstro$elm_bulma_classes$Bulma$Classes$tag = 'tag';
var $author$project$Card$toShortString = function (card) {
	var s = card.b;
	return s;
};
var $author$project$Card$html = F3(
	function (config, attrs, card) {
		var name = config.cardShortNames ? $author$project$Card$toShortString(card) : $author$project$Card$toString(card);
		return A2(
			$elm$html$Html$span,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tag),
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isMedium),
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class(
							$author$project$Card$bulmaClass(card)),
						attrs))),
			_List_fromArray(
				[
					$elm$html$Html$text(name)
				]));
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$View$History$viewGameMsg = F2(
	function (config, msg) {
		var item = function (children) {
			return $elm$core$Maybe$Just(
				A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$box)
						]),
					children));
		};
		var interactiveItem = F2(
			function (onClickMsg, txt) {
				return $elm$core$Maybe$Just(
					A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$box),
								$elm$html$Html$Events$onClick(onClickMsg),
								$elm$html$Html$Attributes$class('is-clickable')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(txt)
							])));
			});
		var cardName = function (card) {
			return config.cardShortNames ? $author$project$Card$toShortString(card) : $author$project$Card$toString(card);
		};
		switch (msg.$) {
			case 'AddCard':
				var card = msg.a;
				var faction = msg.b;
				return item(
					_List_fromArray(
						[
							$elm$html$Html$text('Added '),
							A3($author$project$Card$html, config, _List_Nil, card),
							$elm$html$Html$text(
							' to ' + $author$project$Faction$toString(faction))
						]));
			case 'DiscardCard':
				var card = msg.a;
				var faction = msg.b;
				return item(
					_List_fromArray(
						[
							$elm$html$Html$text('Discarded '),
							A3($author$project$Card$html, config, _List_Nil, card),
							$elm$html$Html$text(
							' from ' + $author$project$Faction$toString(faction))
						]));
			case 'DragDropCardToFaction':
				return $elm$core$Maybe$Nothing;
			case 'Undo':
				return $elm$core$Maybe$Nothing;
			case 'OpenChangeCardModal':
				return $elm$core$Maybe$Nothing;
			case 'FinishHarkonnenCardSwap':
				var target = msg.a;
				return item(
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Harkonnen card swap with ' + $author$project$Faction$toString(target))
						]));
			case 'OpenHarkonnenCardSwapModal':
				return $elm$core$Maybe$Nothing;
			case 'ChangeCardViaModal':
				var change = msg.a;
				return item(
					_List_fromArray(
						[
							$elm$html$Html$text('Changed '),
							A3($author$project$Card$html, config, _List_Nil, change.current),
							$elm$html$Html$text(' to '),
							A3($author$project$Card$html, config, _List_Nil, change._new),
							$elm$html$Html$text(
							' for ' + $author$project$Faction$toString(change.faction))
						]));
			case 'OpenBiddingPhaseModal':
				return $elm$core$Maybe$Nothing;
			case 'AssignBiddingPhaseCards':
				var model = msg.a;
				return A2(
					interactiveItem,
					$author$project$Types$ViewGameMsg(
						$author$project$Types$OpenHistoryModal(
							$author$project$Types$AssignBiddingPhaseCards(model))),
					'Bidding phase');
			case 'ModalMsg':
				return $elm$core$Maybe$Nothing;
			case 'CloseModal':
				return $elm$core$Maybe$Nothing;
			case 'FinishCombat':
				var left = msg.a;
				var right = msg.b;
				return A2(
					interactiveItem,
					$author$project$Types$ViewGameMsg(
						$author$project$Types$OpenHistoryModal(
							A2($author$project$Types$FinishCombat, left, right))),
					'Combat');
			case 'OpenCombatModal':
				return $elm$core$Maybe$Nothing;
			case 'OpenAddCardModal':
				return $elm$core$Maybe$Nothing;
			case 'OpenConfigModal':
				return $elm$core$Maybe$Nothing;
			case 'FinishConfigModal':
				return $elm$core$Maybe$Nothing;
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$View$History$list = F2(
	function (config, history) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2($elm$html$Html$hr, _List_Nil, _List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$section),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isCentered)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$title),
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isCentered)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('History')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isAncestor)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
											$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isParent)
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
													$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isChild),
													$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$hasTextCentered),
													$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$content)
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$columns),
															$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isCentered)
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$column),
																	$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isNarrow)
																]),
															A2(
																$elm$core$List$filterMap,
																$author$project$View$History$viewGameMsg(config),
																history))
														]))
												]))
										]))
								]))
						]))
				]));
	});
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Types$Undo = {$: 'Undo'};
var $ahstro$elm_bulma_classes$Bulma$Classes$button = 'button';
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $ahstro$elm_bulma_classes$Bulma$Classes$level = 'level';
var $ahstro$elm_bulma_classes$Bulma$Classes$levelItem = 'level-item';
var $ahstro$elm_bulma_classes$Bulma$Classes$levelLeft = 'level-left';
var $ahstro$elm_bulma_classes$Bulma$Classes$levelRight = 'level-right';
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $author$project$Main$viewButtons = A2(
	$elm$html$Html$nav,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$level)
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$levelLeft)
				]),
			_List_Nil),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$levelRight)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('add-card-modal-button'),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$levelItem),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg($author$project$Types$OpenAddCardModal))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Add card')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('bidding-phase-button'),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$levelItem),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg($author$project$Types$OpenBiddingPhaseModal))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Bidding phase')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$levelItem),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg($author$project$Types$OpenCombatModal))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Combat')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$levelItem),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg($author$project$Types$OpenHarkonnenCardSwapModal))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Harkonnen Card Swap')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$levelItem),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg($author$project$Types$OpenConfigModal))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Config')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$levelItem),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg($author$project$Types$Undo))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Undo')
						]))
				]))
		]));
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Main$countCards = function (cards) {
	var updater = function (res) {
		if (res.$ === 'Nothing') {
			return $elm$core$Maybe$Just(1);
		} else {
			var x = res.a;
			return $elm$core$Maybe$Just(x + 1);
		}
	};
	var folder = F2(
		function (current, acc) {
			return A3(
				$elm$core$Dict$update,
				$author$project$Card$toString(current),
				updater,
				acc);
		});
	return A3($elm$core$List$foldl, folder, $elm$core$Dict$empty, cards);
};
var $ahstro$elm_bulma_classes$Bulma$Classes$notification = 'notification';
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Types$DragDropCardToFaction = function (a) {
	return {$: 'DragDropCardToFaction', a: a};
};
var $author$project$Card$cardLimitDict = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$weaponPoison),
			4),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$weaponProjectile),
			4),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$weaponLasgun),
			1),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$defensePoison),
			4),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$defenseProjectile),
			4),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$cheapHero),
			3),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$familyAtomics),
			1),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$hajr),
			1),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$karama),
			2),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$ghola),
			1),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$truthTrance),
			2),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$weatherControl),
			1),
			_Utils_Tuple2(
			$author$project$Card$toString($author$project$Card$useless),
			5)
		]));
var $author$project$Card$cardLimit = function (typ) {
	var s = typ.a;
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		A2($elm$core$Dict$get, s, $author$project$Card$cardLimitDict));
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragEnd = {$: 'DragEnd'};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragStart = F2(
	function (a, b) {
		return {$: 'DragStart', a: a, b: b};
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions = F3(
	function (name, _v0, decoder) {
		var stopPropagation = _v0.stopPropagation;
		var preventDefault = _v0.preventDefault;
		return A2(
			$elm$html$Html$Events$custom,
			name,
			A2(
				$elm$json$Json$Decode$map,
				function (msg) {
					return {message: msg, preventDefault: preventDefault, stopPropagation: stopPropagation};
				},
				decoder));
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$draggable = F2(
	function (wrap, drag) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'draggable', 'true'),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragstart',
				{preventDefault: false, stopPropagation: true},
				A2(
					$elm$json$Json$Decode$map,
					A2(
						$elm$core$Basics$composeL,
						wrap,
						$norpan$elm_html5_drag_drop$Html5$DragDrop$DragStart(drag)),
					$elm$json$Json$Decode$value)),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragend',
				{preventDefault: false, stopPropagation: true},
				$elm$json$Json$Decode$succeed(
					wrap($norpan$elm_html5_drag_drop$Html5$DragDrop$DragEnd)))
			]);
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Main$viewDeckCard = F3(
	function (counts, config, card) {
		var limit = $author$project$Card$cardLimit(card);
		var stringLimit = (!limit) ? '∞' : $elm$core$String$fromInt(limit);
		var cardName = config.cardShortNames ? $author$project$Card$toShortString(card) : $author$project$Card$toString(card);
		var cardCount = $elm$core$String$fromInt(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Dict$get,
					$author$project$Card$toString(card),
					counts)));
		var countString = '(' + (cardCount + ('/' + (stringLimit + ')')));
		return A2(
			$elm$html$Html$li,
			A2(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$draggable,
				A2($elm$core$Basics$composeL, $author$project$Types$ViewGameMsg, $author$project$Types$DragDropCardToFaction),
				card),
			_List_fromArray(
				[
					$elm$html$Html$text(cardName + (' ' + countString))
				]));
	});
var $author$project$Main$viewDeck = F2(
	function (config, cardsInPlay) {
		var cardCounts = $author$project$Main$countCards(cardsInPlay);
		var viewCards = function (cards) {
			return A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2(
					$elm$core$List$map,
					A2($author$project$Main$viewDeckCard, cardCounts, config),
					cards));
		};
		var tileEmUp = F2(
			function (cards, colorClass) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isParent)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isChild),
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$notification),
									$elm$html$Html$Attributes$class(colorClass)
								]),
							_List_fromArray(
								[
									viewCards(cards)
								]))
						]));
			});
		var defenseTile = A2(tileEmUp, $author$project$Card$defenses, $ahstro$elm_bulma_classes$Bulma$Classes$isInfo);
		var specialTile = A2(tileEmUp, $author$project$Card$special, $ahstro$elm_bulma_classes$Bulma$Classes$isSuccess);
		var uselessTile = A2(
			tileEmUp,
			_List_fromArray(
				[$author$project$Card$useless]),
			$ahstro$elm_bulma_classes$Bulma$Classes$isWarning);
		var weaponTile = A2(tileEmUp, $author$project$Card$weapons, $ahstro$elm_bulma_classes$Bulma$Classes$isDanger);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isAncestor)
				]),
			_List_fromArray(
				[weaponTile, defenseTile, specialTile, uselessTile]));
	});
var $ahstro$elm_bulma_classes$Bulma$Classes$delete = 'delete';
var $elm$html$Html$header = _VirtualDom_node('header');
var $ahstro$elm_bulma_classes$Bulma$Classes$isActive = 'is-active';
var $ahstro$elm_bulma_classes$Bulma$Classes$modal = 'modal';
var $ahstro$elm_bulma_classes$Bulma$Classes$modalBackground = 'modal-background';
var $ahstro$elm_bulma_classes$Bulma$Classes$modalCard = 'modal-card';
var $ahstro$elm_bulma_classes$Bulma$Classes$modalCardBody = 'modal-card-body';
var $ahstro$elm_bulma_classes$Bulma$Classes$modalCardFoot = 'modal-card-foot';
var $ahstro$elm_bulma_classes$Bulma$Classes$modalCardHead = 'modal-card-head';
var $ahstro$elm_bulma_classes$Bulma$Classes$modalCardTitle = 'modal-card-title';
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$View$modal = F5(
	function (title, onClose, bodyChild, leftButtons, rightButtons) {
		var undoButton = A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Events$onClick(
					$author$project$Types$ViewGameMsg($author$project$Types$Undo))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Undo')
				]));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$modal),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isActive)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$modalBackground)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$modalCard)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$header,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$modalCardHead)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$modalCardTitle)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(title)
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$delete),
											$elm$html$Html$Events$onClick(onClose)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$section,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$modalCardBody)
								]),
							_List_fromArray(
								[bodyChild])),
							A2(
							$elm$html$Html$footer,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$modalCardFoot),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									A2($elm$core$List$cons, undoButton, leftButtons)),
									A2($elm$html$Html$div, _List_Nil, rightButtons)
								]))
						]))
				]));
	});
var $author$project$View$History$modal = F2(
	function (config, msg) {
		switch (msg.$) {
			case 'AssignBiddingPhaseCards':
				var assignments = msg.a;
				var viewAssignment = function (tuple) {
					var _v1 = tuple;
					var card = _v1.a;
					var faction = _v1.b;
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A3($author$project$Card$html, config, _List_Nil, card),
								$elm$html$Html$text(
								' -> ' + $author$project$Faction$toString(faction))
							]));
				};
				var modalTitle = 'Bidding phase';
				var closeButton = A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg($author$project$Types$CloseModal))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Close')
						]));
				var body = A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							A2($elm$core$List$map, viewAssignment, assignments))
						]));
				return A5(
					$author$project$View$modal,
					modalTitle,
					$author$project$Types$ViewGameMsg($author$project$Types$CloseModal),
					body,
					_List_Nil,
					_List_fromArray(
						[closeButton]));
			case 'FinishCombat':
				var left = msg.a;
				var right = msg.b;
				var viewCombatCard = function (cc) {
					var discardSuffix = cc.discard ? ' which was discarded' : '';
					return A2($author$project$Card$eq, cc.card, $author$project$Card$none) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
						A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									A3($author$project$Card$html, config, _List_Nil, cc.card),
									$elm$html$Html$text(discardSuffix)
								])));
				};
				var viewCombatSide = function (side) {
					var cheapHeroCard = side.cheapHero ? _List_fromArray(
						[
							{card: $author$project$Card$cheapHero, discard: true}
						]) : _List_Nil;
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Faction$toString(side.faction)),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$ul,
										_List_Nil,
										A2(
											$elm$core$List$filterMap,
											viewCombatCard,
											A2(
												$elm$core$List$cons,
												side.weapon,
												A2($elm$core$List$cons, side.defense, cheapHeroCard))))
									]))
							]));
				};
				var modalTitle = 'Combat';
				var closeButton = A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess),
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg($author$project$Types$CloseModal))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Close')
						]));
				var body = A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							viewCombatSide(left),
							viewCombatSide(right)
						]));
				return A5(
					$author$project$View$modal,
					modalTitle,
					$author$project$Types$ViewGameMsg($author$project$Types$CloseModal),
					body,
					_List_Nil,
					_List_fromArray(
						[closeButton]));
			default:
				return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		}
	});
var $ahstro$elm_bulma_classes$Bulma$Classes$container = 'container';
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $ahstro$elm_bulma_classes$Bulma$Classes$field = 'field';
var $ahstro$elm_bulma_classes$Bulma$Classes$isGrouped = 'is-grouped';
var $ahstro$elm_bulma_classes$Bulma$Classes$label = 'label';
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $ahstro$elm_bulma_classes$Bulma$Classes$control = 'control';
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $ahstro$elm_bulma_classes$Bulma$Classes$select = 'select';
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$selectControl = function (config) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$control)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$select),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2($ahstro$elm_bulma_classes$Bulma$Classes$isDanger, !config.isValid)
							]))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(config.onSelect)
							]),
						A2(
							$elm$core$List$map,
							function (x) {
								return A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value(
											config.toValueString(x)),
											$elm$html$Html$Attributes$selected(
											A2(config.eq, x, config.current))
										]),
									_List_fromArray(
										[
											config.toHtml(x)
										]));
							},
							config.options))
					]))
			]));
};
var $author$project$View$select = function (config) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$label)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(config.name)
					])),
				$author$project$View$selectControl(config)
			]));
};
var $author$project$Card$uniqueCardsWithUnknown = A2($elm$core$List$cons, $author$project$Card$unknown, $author$project$Card$uniqueCards);
var $author$project$Modal$AddCard$view = F2(
	function (factions, model) {
		var viewFactionSelectControl = function (faction) {
			return $author$project$View$select(
				{
					current: faction,
					eq: $author$project$Faction$eq,
					isValid: !A2($author$project$Faction$eq, faction, $author$project$Faction$unknown),
					name: 'Faction',
					onSelect: function (s) {
						return $author$project$Types$ViewGameMsg(
							$author$project$Types$ModalMsg(
								$author$project$Types$AddCardModalMsg(
									$author$project$Types$SelectAddCardFaction(s))));
					},
					options: A2($elm$core$List$cons, $author$project$Faction$unknown, factions),
					toHtml: function (f) {
						return $elm$html$Html$text(
							$author$project$Faction$toString(f));
					},
					toValueString: $author$project$Faction$toString
				});
		};
		var viewCardTypeSelectControl = function (card) {
			return $author$project$View$select(
				{
					current: card,
					eq: $author$project$Card$eq,
					isValid: true,
					name: 'Card',
					onSelect: function (s) {
						return $author$project$Types$ViewGameMsg(
							$author$project$Types$ModalMsg(
								$author$project$Types$AddCardModalMsg(
									$author$project$Types$SelectAddCardCard(s))));
					},
					options: $author$project$Card$uniqueCardsWithUnknown,
					toHtml: function (c) {
						return $elm$html$Html$text(
							$author$project$Card$toString(c));
					},
					toValueString: $author$project$Card$toString
				});
		};
		var validFactionSelected = !A2($author$project$Faction$eq, $author$project$Faction$unknown, model.faction);
		var modalTitle = 'Add Card';
		var completeButton = A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess),
					$elm$html$Html$Events$onClick(
					$author$project$Types$ViewGameMsg(
						A2($author$project$Types$AddCard, model.card, model.faction))),
					$elm$html$Html$Attributes$disabled(!validFactionSelected)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Assign card')
				]));
		var body = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$container)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isGrouped)
						]),
					_List_fromArray(
						[
							viewCardTypeSelectControl(model.card),
							viewFactionSelectControl(model.faction)
						]))
				]));
		return A5(
			$author$project$View$modal,
			modalTitle,
			$author$project$Types$ViewGameMsg($author$project$Types$CloseModal),
			body,
			_List_Nil,
			_List_fromArray(
				[completeButton]));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Modal$Bidding$view = F2(
	function (factions, model) {
		var viewFactionSelectControl = F2(
			function (index, faction) {
				return $author$project$View$select(
					{
						current: faction,
						eq: $author$project$Faction$eq,
						isValid: !A2($author$project$Faction$eq, faction, $author$project$Faction$unknown),
						name: 'Faction',
						onSelect: function (s) {
							return $author$project$Types$ViewGameMsg(
								$author$project$Types$ModalMsg(
									$author$project$Types$BiddingModalMsg(
										A2($author$project$Types$SelectBiddingFaction, index, s))));
						},
						options: A2($elm$core$List$cons, $author$project$Faction$unknown, factions),
						toHtml: function (f) {
							return $elm$html$Html$text(
								$author$project$Faction$toString(f));
						},
						toValueString: $author$project$Faction$toString
					});
			});
		var viewCardTypeSelectControl = F2(
			function (index, card) {
				return $author$project$View$select(
					{
						current: card,
						eq: $author$project$Card$eq,
						isValid: !A2($author$project$Card$eq, $author$project$Card$unknown, card),
						name: 'Card',
						onSelect: function (s) {
							return $author$project$Types$ViewGameMsg(
								$author$project$Types$ModalMsg(
									$author$project$Types$BiddingModalMsg(
										A2($author$project$Types$SelectBiddingCard, index, s))));
						},
						options: $author$project$Card$uniqueCardsWithUnknown,
						toHtml: function (c) {
							return $elm$html$Html$text(
								$author$project$Card$toString(c));
						},
						toValueString: $author$project$Card$toString
					});
			});
		var viewBid = F2(
			function (index, bid) {
				var card = bid.a;
				var faction = bid.b;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isGrouped)
						]),
					_List_fromArray(
						[
							A2(viewCardTypeSelectControl, index, card),
							A2(viewFactionSelectControl, index, faction)
						]));
			});
		var validFactionsSelected = A2(
			$elm$core$List$all,
			function (bid) {
				return !A2($author$project$Faction$eq, $author$project$Faction$unknown, bid.b);
			},
			$elm$core$Array$toList(model.bids));
		var validCardsSelected = A2(
			$elm$core$List$all,
			function (bid) {
				return !A2($author$project$Card$eq, $author$project$Card$unknown, bid.a);
			},
			$elm$core$Array$toList(model.bids));
		var resetButton = A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Events$onClick(
					$author$project$Types$ViewGameMsg(
						$author$project$Types$ModalMsg(
							$author$project$Types$BiddingModalMsg($author$project$Types$ResetBids))))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Reset')
				]));
		var modalTitle = 'Bidding';
		var bidsList = $elm$core$Array$toList(model.bids);
		var body = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$container)
				]),
			A2($elm$core$List$indexedMap, viewBid, bidsList));
		var assignBidsButton = A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess),
					$elm$html$Html$Events$onClick(
					$author$project$Types$ViewGameMsg(
						$author$project$Types$AssignBiddingPhaseCards(bidsList))),
					$elm$html$Html$Attributes$disabled(!(validFactionsSelected && validCardsSelected))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Assign bids')
				]));
		var addBidButton = A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isInfo),
					$elm$html$Html$Events$onClick(
					$author$project$Types$ViewGameMsg(
						$author$project$Types$ModalMsg(
							$author$project$Types$BiddingModalMsg($author$project$Types$AddBid))))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Add bid')
				]));
		return A5(
			$author$project$View$modal,
			modalTitle,
			$author$project$Types$ViewGameMsg($author$project$Types$CloseModal),
			body,
			_List_fromArray(
				[resetButton, addBidButton]),
			_List_fromArray(
				[assignBidsButton]));
	});
var $ahstro$elm_bulma_classes$Bulma$Classes$hasTextLeft = 'has-text-left';
var $ahstro$elm_bulma_classes$Bulma$Classes$hasTextRight = 'has-text-right';
var $ahstro$elm_bulma_classes$Bulma$Classes$isOneFifth = 'is-one-fifth';
var $ahstro$elm_bulma_classes$Bulma$Classes$isTwoFifths = 'is-two-fifths';
var $ahstro$elm_bulma_classes$Bulma$Classes$hasAddons = 'has-addons';
var $author$project$View$selectWithButton = function (config) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$label)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(config.selectConfig.name)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$control)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field),
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$hasAddons)
							]),
						_List_fromArray(
							[
								$author$project$View$selectControl(config.selectConfig),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$control)
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
												config.buttonClass,
												$elm$html$Html$Events$onClick(config.onButtonClick)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(config.buttonText)
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Modal$Combat$view = F2(
	function (factions, model) {
		var viewFactionSelect = F3(
			function (faction, otherFaction, msg) {
				return $author$project$View$select(
					{
						current: faction,
						eq: $author$project$Faction$eq,
						isValid: (!A2($author$project$Faction$eq, faction, $author$project$Faction$unknown)) && (!A2($author$project$Faction$eq, faction, otherFaction)),
						name: 'Faction',
						onSelect: function (s) {
							return $author$project$Types$ViewGameMsg(
								$author$project$Types$ModalMsg(
									$author$project$Types$CombatModalMsg(
										msg(s))));
						},
						options: A2($elm$core$List$cons, $author$project$Faction$unknown, factions),
						toHtml: function (f) {
							return $elm$html$Html$text(
								$author$project$Faction$toString(f));
						},
						toValueString: $author$project$Faction$toString
					});
			});
		var viewCardSelectWithDiscard = F6(
			function (name, cardSelectMsg, checkboxMsg, card, cards, isDiscard) {
				var selectConfig = {
					current: card,
					eq: $author$project$Card$eq,
					isValid: !A2($author$project$Card$eq, card, $author$project$Card$unknown),
					name: name,
					onSelect: function (s) {
						return $author$project$Types$ViewGameMsg(
							$author$project$Types$ModalMsg(
								$author$project$Types$CombatModalMsg(
									cardSelectMsg(s))));
					},
					options: cards,
					toHtml: function (c) {
						return $elm$html$Html$text(
							$author$project$Card$toString(c));
					},
					toValueString: $author$project$Card$toString
				};
				var selectConfigWithButton = isDiscard ? {
					buttonClass: $elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isDanger),
					buttonText: 'Discard',
					onButtonClick: $author$project$Types$ViewGameMsg(
						$author$project$Types$ModalMsg(
							$author$project$Types$CombatModalMsg(checkboxMsg))),
					selectConfig: selectConfig
				} : {
					buttonClass: $elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess),
					buttonText: 'Keep',
					onButtonClick: $author$project$Types$ViewGameMsg(
						$author$project$Types$ModalMsg(
							$author$project$Types$CombatModalMsg(checkboxMsg))),
					selectConfig: selectConfig
				};
				return $author$project$View$selectWithButton(selectConfigWithButton);
			});
		var resetButton = A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Events$onClick(
					$author$project$Types$ViewGameMsg(
						$author$project$Types$ModalMsg(
							$author$project$Types$CombatModalMsg($author$project$Types$ResetCombatModal))))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Reset')
				]));
		var modalTitle = 'Combat';
		var isValid = (!A2($author$project$Faction$eq, $author$project$Faction$unknown, model.left.faction)) && ((!A2($author$project$Faction$eq, $author$project$Faction$unknown, model.right.faction)) && (!A2($author$project$Faction$eq, model.left.faction, model.right.faction)));
		var finishButton = A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess),
					$elm$html$Html$Events$onClick(
					$author$project$Types$ViewGameMsg(
						A2($author$project$Types$FinishCombat, model.left, model.right))),
					$elm$html$Html$Attributes$disabled(!isValid)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Finish')
				]));
		var cheapHeroSelect = F2(
			function (side, isOn) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$label)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cheap hero played')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$control)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
											$elm$html$Html$Attributes$classList(
											_List_fromArray(
												[
													_Utils_Tuple2($ahstro$elm_bulma_classes$Bulma$Classes$isDanger, isOn),
													_Utils_Tuple2($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess, !isOn)
												])),
											$elm$html$Html$Events$onClick(
											$author$project$Types$ViewGameMsg(
												$author$project$Types$ModalMsg(
													$author$project$Types$CombatModalMsg(
														$author$project$Types$ToggleCheapHero(side)))))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											isOn ? 'Yes' : 'No')
										]))
								]))
						]));
			});
		var viewCards = F2(
			function (side, combatSide) {
				return _List_fromArray(
					[
						A6(
						viewCardSelectWithDiscard,
						'Weapon',
						$author$project$Types$SelectWeapon(side),
						$author$project$Types$ToggleWeaponDiscard(side),
						combatSide.weapon.card,
						A2(
							$elm$core$List$cons,
							$author$project$Card$none,
							A2($elm$core$List$cons, $author$project$Card$useless, $author$project$Card$weapons)),
						combatSide.weapon.discard),
						A6(
						viewCardSelectWithDiscard,
						'Defense',
						$author$project$Types$SelectDefense(side),
						$author$project$Types$ToggleDefenseDiscard(side),
						combatSide.defense.card,
						A2(
							$elm$core$List$cons,
							$author$project$Card$none,
							A2($elm$core$List$cons, $author$project$Card$useless, $author$project$Card$defenses)),
						combatSide.defense.discard),
						A2(cheapHeroSelect, side, combatSide.cheapHero)
					]);
			});
		var viewLeftSide = $elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						A3(
						viewFactionSelect,
						model.left.faction,
						model.right.faction,
						$author$project$Types$SelectFaction($author$project$Types$Left))
					]),
					A2(viewCards, $author$project$Types$Left, model.left)
				]));
		var viewRightSide = $elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						A3(
						viewFactionSelect,
						model.right.faction,
						model.left.faction,
						$author$project$Types$SelectFaction($author$project$Types$Right))
					]),
					A2(viewCards, $author$project$Types$Right, model.right)
				]));
		var body = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$columns)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$column),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$hasTextLeft),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isTwoFifths)
						]),
					viewLeftSide),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$column),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$hasTextCentered),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isOneFifth)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('VS')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$column),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$hasTextRight),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isTwoFifths)
						]),
					viewRightSide)
				]));
		return A5(
			$author$project$View$modal,
			modalTitle,
			$author$project$Types$ViewGameMsg($author$project$Types$CloseModal),
			body,
			_List_fromArray(
				[resetButton]),
			_List_fromArray(
				[finishButton]));
	});
var $ahstro$elm_bulma_classes$Bulma$Classes$checkbox = 'checkbox';
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Modal$Config$view = function (model) {
	var toggleField = F3(
		function (msg, description, currentValue) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$control)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$checkbox)
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('checkbox'),
												$elm$html$Html$Attributes$checked(currentValue),
												$elm$html$Html$Events$onClick(
												$author$project$Types$ViewGameMsg(
													$author$project$Types$ModalMsg(
														$author$project$Types$ConfigModalMsg(msg))))
											]),
										_List_Nil),
										$elm$html$Html$text(description)
									]))
							]))
					]));
		});
	var title = 'Config';
	var body = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$container)
			]),
		_List_fromArray(
			[
				A3(toggleField, $author$project$Types$ToggleCardShortNames, 'Show short names for cards', model.cardShortNames),
				A3(toggleField, $author$project$Types$ToggleHandLimits, 'Enforce hand limits', model.handLimits),
				A3(toggleField, $author$project$Types$ToggleDoubleAddToHarkonnen, 'Add unknown card to harkonnen automatically during bidding', model.doubleAddToHarkonnen)
			]));
	var applyButton = A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess),
				$elm$html$Html$Events$onClick(
				$author$project$Types$ViewGameMsg($author$project$Types$FinishConfigModal))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Apply')
			]));
	return A5(
		$author$project$View$modal,
		title,
		$author$project$Types$ViewGameMsg($author$project$Types$CloseModal),
		body,
		_List_Nil,
		_List_fromArray(
			[applyButton]));
};
var $author$project$Modal$HarkonnenCardSwap$view = F2(
	function (factions, model) {
		var validFactionSelected = !A2($author$project$Faction$eq, $author$project$Faction$unknown, model.target);
		var swapButton = A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess),
					$elm$html$Html$Events$onClick(
					$author$project$Types$ViewGameMsg(
						$author$project$Types$FinishHarkonnenCardSwap(model.target))),
					$elm$html$Html$Attributes$disabled(!validFactionSelected)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Swap')
				]));
		var modalTitle = 'Harkonnen card swap';
		var factionsWithoutHarkonnen = A2(
			$elm$core$List$filter,
			function (f) {
				return !A2($author$project$Faction$eq, $author$project$Faction$harkonnen, f);
			},
			factions);
		var viewFactionSelectControl = function (faction) {
			return $author$project$View$select(
				{
					current: faction,
					eq: $author$project$Faction$eq,
					isValid: !A2($author$project$Faction$eq, faction, $author$project$Faction$unknown),
					name: 'Swap with faction',
					onSelect: function (s) {
						return $author$project$Types$ViewGameMsg(
							$author$project$Types$ModalMsg(
								$author$project$Types$HarkonnenCardSwapModalMsg(
									$author$project$Types$SelectHarkonnenCardSwapMsg(s))));
					},
					options: A2($elm$core$List$cons, $author$project$Faction$unknown, factionsWithoutHarkonnen),
					toHtml: function (f) {
						return $elm$html$Html$text(
							$author$project$Faction$toString(f));
					},
					toValueString: $author$project$Faction$toString
				});
		};
		var body = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$container)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isGrouped)
						]),
					_List_fromArray(
						[
							viewFactionSelectControl(model.target)
						]))
				]));
		return A5(
			$author$project$View$modal,
			modalTitle,
			$author$project$Types$ViewGameMsg($author$project$Types$CloseModal),
			body,
			_List_Nil,
			_List_fromArray(
				[swapButton]));
	});
var $author$project$View$button = F3(
	function (attributes, clickMsg, name) {
		var allAttributes = A2(
			$elm$core$List$append,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
					$elm$html$Html$Events$onClick(clickMsg)
				]),
			attributes);
		return A2(
			$elm$html$Html$button,
			allAttributes,
			_List_fromArray(
				[
					$elm$html$Html$text(name)
				]));
	});
var $author$project$View$cardTypeSelect = F3(
	function (cards, onSelect, selectedCard) {
		return $author$project$View$select(
			{
				current: selectedCard,
				eq: $author$project$Card$eq,
				isValid: true,
				name: 'Card',
				onSelect: onSelect,
				options: cards,
				toHtml: function (c) {
					return $elm$html$Html$text(
						$author$project$Card$toString(c));
				},
				toValueString: $author$project$Card$toString
			});
	});
var $author$project$Main$viewChangeCardModal = function (model) {
	var modalTitle = 'Identifying card for ' + $author$project$Faction$toString(model.faction);
	var footerChild = A3(
		$author$project$View$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('identify-card-button'),
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSuccess)
			]),
		$author$project$Types$ViewGameMsg(
			$author$project$Types$ChangeCardViaModal(
				{current: model.clickedCard, faction: model.faction, _new: model.selectedCard})),
		'Identify Card');
	var body = A3(
		$author$project$View$cardTypeSelect,
		$author$project$Card$uniqueCardsWithUnknown,
		function (s) {
			return $author$project$Types$ViewGameMsg(
				$author$project$Types$ModalMsg(
					$author$project$Types$SelectIdentifyCard(s)));
		},
		model.selectedCard);
	return A5(
		$author$project$View$modal,
		modalTitle,
		$author$project$Types$ViewGameMsg($author$project$Types$CloseModal),
		body,
		_List_Nil,
		_List_fromArray(
			[footerChild]));
};
var $author$project$Main$viewModal = F4(
	function (factions, config, _v0, modal) {
		switch (modal.$) {
			case 'ModalChangeCard':
				var model = modal.a;
				return $author$project$Main$viewChangeCardModal(model);
			case 'ModalBidding':
				var model = modal.a;
				return A2($author$project$Modal$Bidding$view, factions, model);
			case 'ModalCombat':
				var model = modal.a;
				return A2($author$project$Modal$Combat$view, factions, model);
			case 'ModalAddCard':
				var model = modal.a;
				return A2($author$project$Modal$AddCard$view, factions, model);
			case 'ModalConfig':
				var model = modal.a;
				return $author$project$Modal$Config$view(model);
			case 'ModalHistory':
				var msg = modal.a;
				return A2($author$project$View$History$modal, config, msg);
			default:
				var model = modal.a;
				return A2($author$project$Modal$HarkonnenCardSwap$view, factions, model);
		}
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragEnter = function (a) {
	return {$: 'DragEnter', a: a};
};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragLeave = function (a) {
	return {$: 'DragLeave', a: a};
};
var $norpan$elm_html5_drag_drop$Html5$DragDrop$DragOver = F3(
	function (a, b, c) {
		return {$: 'DragOver', a: a, b: b, c: c};
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$Drop = F2(
	function (a, b) {
		return {$: 'Drop', a: a, b: b};
	});
var $norpan$elm_html5_drag_drop$Html5$DragDrop$Position = F4(
	function (width, height, x, y) {
		return {height: height, width: width, x: x, y: y};
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$core$Basics$round = _Basics_round;
var $norpan$elm_html5_drag_drop$Html5$DragDrop$positionDecoder = A5(
	$elm$json$Json$Decode$map4,
	$norpan$elm_html5_drag_drop$Html5$DragDrop$Position,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['currentTarget', 'clientWidth']),
		$elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['currentTarget', 'clientHeight']),
		$elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Basics$round,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['offsetX']),
			$elm$json$Json$Decode$float)),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Basics$round,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['offsetY']),
			$elm$json$Json$Decode$float)));
var $norpan$elm_html5_drag_drop$Html5$DragDrop$timeStampDecoder = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Basics$round,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['timeStamp']),
		$elm$json$Json$Decode$float));
var $norpan$elm_html5_drag_drop$Html5$DragDrop$droppable = F2(
	function (wrap, dropId) {
		return _List_fromArray(
			[
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragenter',
				{preventDefault: true, stopPropagation: true},
				$elm$json$Json$Decode$succeed(
					wrap(
						$norpan$elm_html5_drag_drop$Html5$DragDrop$DragEnter(dropId)))),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragleave',
				{preventDefault: true, stopPropagation: true},
				$elm$json$Json$Decode$succeed(
					wrap(
						$norpan$elm_html5_drag_drop$Html5$DragDrop$DragLeave(dropId)))),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'dragover',
				{preventDefault: true, stopPropagation: false},
				A2(
					$elm$json$Json$Decode$map,
					wrap,
					A3(
						$elm$json$Json$Decode$map2,
						$norpan$elm_html5_drag_drop$Html5$DragDrop$DragOver(dropId),
						$norpan$elm_html5_drag_drop$Html5$DragDrop$timeStampDecoder,
						$norpan$elm_html5_drag_drop$Html5$DragDrop$positionDecoder))),
				A3(
				$norpan$elm_html5_drag_drop$Html5$DragDrop$onWithOptions,
				'drop',
				{preventDefault: true, stopPropagation: true},
				A2(
					$elm$json$Json$Decode$map,
					A2(
						$elm$core$Basics$composeL,
						wrap,
						$norpan$elm_html5_drag_drop$Html5$DragDrop$Drop(dropId)),
					$norpan$elm_html5_drag_drop$Html5$DragDrop$positionDecoder))
			]);
	});
var $ahstro$elm_bulma_classes$Bulma$Classes$hasTextWeightBold = 'has-text-weight-bold';
var $ahstro$elm_bulma_classes$Bulma$Classes$isDelete = 'is-delete';
var $ahstro$elm_bulma_classes$Bulma$Classes$tags = 'tags';
var $author$project$Card$htmlWithDiscard = F4(
	function (config, attrs, deleteMsg, card) {
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tags),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$hasAddons)
				]),
			_List_fromArray(
				[
					A3($author$project$Card$html, config, attrs, card),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tag),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isMedium),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isDelete),
							$elm$html$Html$Events$onClick(deleteMsg)
						]),
					_List_Nil)
				]));
	});
var $elm$html$Html$i = _VirtualDom_node('i');
var $ahstro$elm_bulma_classes$Bulma$Classes$icon = 'icon';
var $ahstro$elm_bulma_classes$Bulma$Classes$isSize5 = 'is-size-5';
var $ahstro$elm_bulma_classes$Bulma$Classes$isVertical = 'is-vertical';
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$Main$toHtmlId = function (s) {
	return A3(
		$elm$core$String$replace,
		' ',
		'-',
		$elm$core$String$toLower(s));
};
var $author$project$Main$viewPlayerTiles = F2(
	function (players, config) {
		var playerTile = function (player) {
			var viewCardName = function (card) {
				return config.cardShortNames ? $author$project$Card$toShortString(card) : $author$project$Card$toString(card);
			};
			var viewCard = F2(
				function (card, faction) {
					var attr = _List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Types$ViewGameMsg(
								A2($author$project$Types$OpenChangeCardModal, faction, card))),
							$elm$html$Html$Attributes$class('is-clickable')
						]);
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A4(
								$author$project$Card$htmlWithDiscard,
								config,
								attr,
								$author$project$Types$ViewGameMsg(
									A2($author$project$Types$DiscardCard, card, faction)),
								card)
							]));
				});
			var discardIcon = F2(
				function (card, faction) {
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$icon),
								$elm$html$Html$Events$onClick(
								$author$project$Types$ViewGameMsg(
									A2($author$project$Types$DiscardCard, card, faction)))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('fas'),
										$elm$html$Html$Attributes$class('fa-times-circle')
									]),
								_List_Nil)
							]));
				});
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isParent)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$append,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isChild),
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$box)
								]),
							A2(
								$norpan$elm_html5_drag_drop$Html5$DragDrop$droppable,
								A2($elm$core$Basics$composeL, $author$project$Types$ViewGameMsg, $author$project$Types$DragDropCardToFaction),
								player.faction)),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$container)
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isSize5),
												$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$hasTextWeightBold)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$author$project$Faction$toString(player.faction))
											])),
										A2(
										$elm$html$Html$ul,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id(
												$author$project$Main$toHtmlId(
													$author$project$Faction$toString(player.faction)) + '-cards')
											]),
										A2(
											$elm$core$List$map,
											function (card) {
												return A2(viewCard, card, player.faction);
											},
											player.hand))
									]))
							]))
					]));
		};
		var playerTiles = A2($elm$core$List$map, playerTile, players);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isAncestor)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile),
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isVertical)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile)
								]),
							A2($elm$core$List$take, 3, playerTiles)),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$tile)
								]),
							A2($elm$core$List$drop, 3, playerTiles))
						]))
				]));
	});
var $author$project$Main$viewGame = function (game) {
	var factions = A2(
		$elm$core$List$map,
		function (p) {
			return p.faction;
		},
		game.players);
	var modal = A2(
		$elm$core$Maybe$withDefault,
		A2($elm$html$Html$div, _List_Nil, _List_Nil),
		A2(
			$elm$core$Maybe$map,
			function (m) {
				return A4($author$project$Main$viewModal, factions, game.config, _List_Nil, m);
			},
			game.modal));
	return A3(
		$elm$html$Html$node,
		'body',
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$section,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$section)
					]),
				_List_fromArray(
					[
						$author$project$Main$viewButtons,
						A2(
						$author$project$Main$viewDeck,
						game.config,
						A2(
							$elm$core$List$concatMap,
							function (player) {
								return player.hand;
							},
							game.players)),
						A2($author$project$Main$viewPlayerTiles, game.players, game.config),
						A3($elm$html$Html$Lazy$lazy2, $author$project$View$History$list, game.config, game.history)
					])),
				modal
			]));
};
var $author$project$Types$ResetGame = {$: 'ResetGame'};
var $author$project$Types$ToggleNavbar = {$: 'ToggleNavbar'};
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $ahstro$elm_bulma_classes$Bulma$Classes$navbar = 'navbar';
var $ahstro$elm_bulma_classes$Bulma$Classes$navbarBrand = 'navbar-brand';
var $ahstro$elm_bulma_classes$Bulma$Classes$navbarBurger = 'navbar-burger';
var $ahstro$elm_bulma_classes$Bulma$Classes$navbarItem = 'navbar-item';
var $ahstro$elm_bulma_classes$Bulma$Classes$navbarMenu = 'navbar-menu';
var $ahstro$elm_bulma_classes$Bulma$Classes$navbarStart = 'navbar-start';
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $author$project$Main$viewNavbar = function (isExpanded) {
	var navbarId = 'duneNavbar';
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$navbar)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$navbarBrand)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$navbarItem)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$img,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src(''),
										$elm$html$Html$Attributes$width(112),
										$elm$html$Html$Attributes$height(28)
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('navbar-expand-button'),
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$navbarBurger),
								$elm$html$Html$Attributes$class('burger'),
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2($ahstro$elm_bulma_classes$Bulma$Classes$isActive, isExpanded)
									])),
								A2($elm$html$Html$Attributes$attribute, 'data-target', navbarId),
								$elm$html$Html$Events$onClick($author$project$Types$ToggleNavbar)
							]),
						A2(
							$elm$core$List$repeat,
							3,
							A2($elm$html$Html$span, _List_Nil, _List_Nil)))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$navbarMenu),
						$elm$html$Html$Attributes$id(navbarId),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2($ahstro$elm_bulma_classes$Bulma$Classes$isActive, isExpanded)
							]))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$navbarStart)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('new-game-button'),
										$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$navbarItem),
										$elm$html$Html$Events$onClick($author$project$Types$ResetGame)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('New game')
									]))
							]))
					]))
			]));
};
var $author$project$Types$CreateGame = function (a) {
	return {$: 'CreateGame', a: a};
};
var $author$project$Types$ToggleFaction = function (a) {
	return {$: 'ToggleFaction', a: a};
};
var $author$project$Types$ViewSetupMsg = function (a) {
	return {$: 'ViewSetupMsg', a: a};
};
var $pzp1997$assoc_list$AssocList$filter = F2(
	function (isGood, _v0) {
		var alist = _v0.a;
		return $pzp1997$assoc_list$AssocList$D(
			A2(
				$elm$core$List$filter,
				function (_v1) {
					var key = _v1.a;
					var value = _v1.b;
					return A2(isGood, key, value);
				},
				alist));
	});
var $ahstro$elm_bulma_classes$Bulma$Classes$isLink = 'is-link';
var $pzp1997$assoc_list$AssocList$keys = function (_v0) {
	var alist = _v0.a;
	return A2($elm$core$List$map, $elm$core$Tuple$first, alist);
};
var $author$project$Main$viewSetup = function (model) {
	var factionField = function (faction) {
		var idAttribute = $elm$html$Html$Attributes$id(
			$elm$core$String$toLower(
				A3(
					$elm$core$String$replace,
					' ',
					'-',
					$author$project$Faction$toString(faction) + '-faction-toggle')));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$control)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$checkbox)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											idAttribute,
											$elm$html$Html$Attributes$type_('checkbox'),
											$elm$html$Html$Attributes$checked(
											A2(
												$elm$core$Maybe$withDefault,
												false,
												A2($pzp1997$assoc_list$AssocList$get, faction, model.factions))),
											$elm$html$Html$Events$onClick(
											$author$project$Types$ViewSetupMsg(
												$author$project$Types$ToggleFaction(faction)))
										]),
									_List_Nil),
									$elm$html$Html$text(
									$author$project$Faction$toString(faction))
								]))
						]))
				]));
	};
	var fields = A2(
		$elm$core$List$map,
		factionField,
		$pzp1997$assoc_list$AssocList$keys(model.factions));
	var currentSelectedFactions = $pzp1997$assoc_list$AssocList$keys(
		A2(
			$pzp1997$assoc_list$AssocList$filter,
			F2(
				function (_v0, selected) {
					return selected;
				}),
			model.factions));
	var startGameField = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$field)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$control)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('create-game-button'),
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$button),
								$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$isLink),
								$elm$html$Html$Events$onClick(
								$author$project$Types$ViewSetupMsg(
									$author$project$Types$CreateGame(currentSelectedFactions)))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Create game')
							]))
					]))
			]));
	return A3(
		$elm$html$Html$node,
		'body',
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$section,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class($ahstro$elm_bulma_classes$Bulma$Classes$section)
					]),
				$elm$core$List$concat(
					_List_fromArray(
						[
							fields,
							_List_fromArray(
							[startGameField])
						])))
			]));
};
var $author$project$Main$view = function (model) {
	var body = function () {
		var _v0 = model.page;
		if (_v0.$ === 'ViewSetup') {
			var setup = _v0.a;
			return $author$project$Main$viewSetup(setup);
		} else {
			var game = _v0.a;
			return $author$project$Main$viewGame(game);
		}
	}();
	return A3(
		$elm$html$Html$node,
		'body',
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Main$viewNavbar(model.navbarExpanded),
				body,
				$author$project$Main$viewFooter
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$value)
			])))(0)}});}(this));