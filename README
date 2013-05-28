JS_StringParser
===============

A string parser in JavaScript, handles basic math (order of operation) and some intrinsic functions.

NUMERIC:
	(\-)?([0-9]+(\.)?[0-9]*|\.[0-9]+)
	
	Examples:
		1
		1.2
		1.
		.5
		-3 // These require a "cheat" in the tokenizer, which I'm not completely happy with

OPERATOR:
	[+|\-|*|\/|\^|%|!|\(|\)|,]
	
	Supported operators:
		+
		-
		*
		/
		% // Modulo
		^ // Power
		! // Factorial
		
FUNCTION
	(sin|cos|tan|asin|acos|atan[2]?|sqrt|exp|log|abs|max|min)
	
	Supported functions:
		sin
		cos
		tan
		asin
		acos
		atan
		sqrt
		exp
		log
		abs
		atan2
		max
		min
		
VARIABLE
	[$]("|')(\w+|\s+|\W+)+("|')
	
	The current implementation takes the part inside the ".." as a jQuery selector
	and returns the html of the element as a number (if possible) or as zero.