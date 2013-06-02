var stringParser = (function(s, xGrammar) {
	var xGrammarDefault = {
		'NUMERIC': {
			literal: '(\\-)?([0-9]+(\\.)?[0-9]*|\\.[0-9]+)'
			// -> ([+|\-|*|\/|\^|%|!|\(|\|,]\s*\-)?([0-9]+(\.)?[0-9]*|\.[0-9]+)
			// but then only the right part has to be taken, and the numbers will not be recognized afterwards..
		},
		
		'CONSTANT': {
			literal: '(e|pi)',
			
			'e': function() {
				return Math.E;
			},
			
			'pi': function() {
				return Math.PI;
			}
		},
		
		'OPERATOR': {
			literal: '[+|\\-|*|\\/|\\^|%|!|\\(|\\)|,]',
			
			'+': {
				prior: 2,
				assoc: 2,
				nop: 2,
				fnc: function(a) { return a[1] + a[0]; }
			},
			
			'-': {
				prior: 2,
				assoc: 2,
				nop: 2,
				fnc: function(a) { return a[1] - a[0]; }
			},
			
			'*': {
				prior: 3,
				assoc: 2,
				nop: 2,
				fnc: function(a) { return a[1] * a[0]; }
			},
			
			'/': {
				name: '/',
				prior: 3,
				assoc: 2,
				nop: 2,
				fnc: function(a) { return a[1] / a[0]; }
			},
			
			'%': {
				prior: 3,
				assoc: 2,
				nop: 2,
				fnc: function(a) { return a[1] % a[0]; }
			},
			
			'^': {
				prior: 3,
				assoc: 1,
				nop: 2,
				fnc: function(a) { return Math.pow(a[1], a[0]); }
			},
			
			'!': {
				name: '!',
				prior: 4,
				assoc: 1,
				nop: 1,
				fnc: function(a) {
					if (a[0] <= 1) return 1;
					
					var n = a[0];
					var r = 1;
					
					while (n > 1) {
						r *= n;
						n--;
					}
					
					return r;
				}
			}
		},
		
		'FUNCTION': {
			literal: '(sin|cos|tan|asin|acos|atan[2]?|sqrt|exp|log|abs|max|min)',
			
			'sin': {
				nop: 1,
				fnc: function(a) { return Math.sin(a[0]); }
			},
			
			'cos': {
				nop: 1,
				fnc: function(a) { return Math.cos(a[0]); }
			},
			
			'tan': {
				nop: 1,
				fnc: function(a) { return Math.tan(a[0]); }
			},
			
			'asin': {
				nop: 1,
				fnc: function(a) { return Math.asin(a[0]); }
			},
			
			'acos': {
				nop: 1,
				fnc: function(a) { return Math.acos(a[0]); }
			},
			
			'atan': {
				nop: 1,
				fnc: function(a) { return Math.atan(a[0]); }
			},
			
			'sqrt': {
				nop: 1,
				fnc: function(a) { return Math.sqrt(a[0]); }
			},
			
			'exp': {
				nop: 1,
				fnc: function(a) { return Math.exp(a[0]); }
			},
			
			'log': {
				nop: 1,
				fnc: function(a) { return Math.log(a[0]); }
			},
			
			'abs': {
				nop: 1,
				fnc: function(a) { return Math.abs(a[0]); }
			},
			
			'atan2': {
				nop: 2,
				fnc: function(a) { return Math.atan2(a[1], a[0]); }
			},
			
			'max': {
				nop: 2,
				fnc: function(a) { return Math.max(a[1], a[0]); }
			},
			
			'min': {
				nop: 2,
				fnc: function(a) { return Math.min(a[1], a[0]); }
			}
		},
		
		'VARIABLE': {
			literal: '[$]("|\')(\\w+|\\s+|\\W+)+("|\')',
			
			fnc: function(a) {
				var el = $(a.substring(2, a.length - 1));
				
				var val = el.html();
				if (isNumber(val)) {
					return parseFloat(val);
				} else {
					return 0;
				}
			}
		}
	};
	
	if (typeof xGrammar == 'undefined') {
		xGrammar = xGrammarDefault;
	}
	
	var axRegexp = [];
	$.each(xGrammar, function(key, value) {
		xGrammar[key].regexp = new RegExp('^' + value.literal);
	});
	
	var isNumber = function(a) {
		return !isNaN(parseFloat(a)) && isFinite(a);	
	}
	
	var tokenizer = function(code) {
		code = code.toLowerCase();
		var axCode = [];

		while (code.length > 0) {
			var matchFound = false;
			
			$.each(xGrammar, function(key, value) {
				if (!matchFound) {
					var match = code.match(xGrammar[key].regexp);
				
					if (match) {
						matchFound = true;
						
						// CHEAT FOR NEGATIVE NUMBERS
						if (key == 'NUMERIC' || key == 'VARIABLE' || key == 'CONSTANT') {
							if (match[0].charAt(0) == '-') {
								if (axCode.length == 0) {
									// OK
								} else {
									if (axCode[axCode.length -1].match(xGrammar['OPERATOR'].regexp) && axCode[axCode.length -1] != ')') {
										// OK
									} else {
										matchFound = false;
									}
								}
							}
						}
						
						if (matchFound) {
							axCode.push(match[0].trim());
							code = code.substring(match[0].length).trim();
						
							//$('#debug').append(match[0] + '<br/>');
						}
					}
				}
			});
			
			if (!matchFound) {
				throw "ERROR, UNMATCHED TOKEN " + code;
			}
		}
		
		return axCode;
	}

	var shuntingYard = function(axCalc) {
		var axOutput = [];
		var axStack = [];
		
		for(var i = 0; i < axCalc.length; i++) {
			var xToken = axCalc[i];
			
			// NUMBERS
			if (xToken.match(xGrammar['NUMERIC'].regexp)) {
				axOutput.push(parseFloat(xToken));
				
			// VARIABLES
			} else if (xToken.match(xGrammar['VARIABLE'].regexp)) {
				axOutput.push(xGrammar['VARIABLE'].fnc(xToken));
				
			} else if (xToken.match(xGrammar['CONSTANT'].regexp)) {
				axOutput.push(xGrammar['CONSTANT'][xToken]());
				
			// FUNCTIONS
			} else if (xToken.match(xGrammar['FUNCTION'].regexp)) {
				axStack.push(xToken);
			
			// ARGUMENT SEPARATOR
			} else if (xToken == ',') {
				while(true) {
					var xOperator = axStack.pop();
					
					if (xOperator == '(') {
						axStack.push(xOperator);
						break;
					} else {
						axOutput.push(xOperator);
					}
					
					if (axStack.length == 0) {
						throw "ERROR, MISSMATCHED PARANTHESES";
					}
				}
			
			// LEFT BRACKET
			} else if (xToken == '(') {
				axStack.push(xToken);
				
			// RIGHT BRACKET
			} else if (xToken == ')') {
				while (true) {
					var xOperator = axStack.pop();
					
					if (xOperator == '(') {
						break;
					} else {
						axOutput.push(xOperator);
					}
					
					if (axStack.length == 0) {
						throw "ERROR, MISSMATCHED PARANTHESES";
					}
				}
				
				var xFunction = axStack.pop();
				if (xFunction.match(xGrammar['FUNCTION'].regexp)) {
					axOutput.push(xFunction);
				} else {
					axStack.push(xFunction);
				}
				
			// OPERATOR
			} else if (xToken.match(xGrammar['OPERATOR'].regexp)) {
				var xOperator = xGrammar['OPERATOR'][xToken];
				
				while (axStack.length > 0) {
					var op = axStack.pop();
					if (op == '(') {
						axStack.push(op);
						break;
					}
					var xLastOp = xGrammar['OPERATOR'][op];
					
					if ( (xOperator.assoc == 2 && xOperator.prior <= xLastOp.prior) || (xOperator.assoc == 1 && xOperator.prior < xLastOp.prior) ) {
						axOutput.push(op);
					} else {
						axStack.push(op);
						break;
					}
				}
				
				axStack.push(xToken);
			
			// UNKNOWN
			} else {
				throw "ERROR, UNKNOWN TOKEN";
			}
		}
		
		// FINISH UP
		while (axStack.length > 0) {
			var xOperator = axStack.pop();
			
			if (xOperator == '(' || xOperator == ')') {
				throw "ERROR, MISSMATCHED PARANTHESES";
			}
			
			axOutput.push(xOperator);
		}
		
		return axOutput;
	}

	var polnishCalc = function(axOutput) {
		/*for(var i = 0; i < axOutput.length; i++) {
			$('#debug').append(axOutput[i] + "<br />");
		}*/
		
		// POLNISH RESOLVER
		var parsePos = 0;
		while (axOutput.length > 1) {
			parsePos++;
			
			var xToken = axOutput[parsePos];
			
			var doOp = false;
			var xOperation;
			
			if (typeof xToken == 'string') {
				if (xToken.match(xGrammar['OPERATOR'].regexp)) {
					xOperation = xGrammar['OPERATOR'][xToken];
					
					doOp = true;
				} else if (xToken.match(xGrammar['FUNCTION'].regexp)) {
					xOperation = xGrammar['FUNCTION'][xToken];
					
					doOp = true;
				}
			}
			
			if (doOp) {
				if (typeof xOperation == 'undefined') { alert(xToken) }
				var axArg = [];
				for (var i = 0; i < xOperation.nop; i++) {
					axArg.push(axOutput[parsePos -1]);
					axOutput.splice(parsePos-- -1, 1);
				}
				
				axOutput.splice(parsePos, 1, xOperation.fnc(axArg));
			}

			if (parsePos > axOutput.length) {
				throw "ERROR, IMBALANCED CALCULATION";
			}
		}
		
		return axOutput[0];
	}

	return polnishCalc(
		shuntingYard(
			tokenizer(s)
		)
	);

	/* TEST 1 */
	/*
	var res = polnishCalc(
		shuntingYard([
			'3', '+', '2', '*', 'sin', '(', '3', '*', '3', '+', '2', '*', '2', '^', '2', '+', '1', '*', '3', '!', ')', '*', '4', '-', '3', '*', 'sin', '(', '2', ')', '-', '3', '+', '4', '*', 'atan2', '(', '2', '*', '(', '5', '*', '2', '+', '3', ')', ',', '3', '*', '2', '+',  '1', ')', '+', '3', '*', '2'
		])
	);
	*/

	/* TEST 2 */
	/*
	var s = '3+2*sin(3*3+2*2^2+1*3!)*4-3*sin(2)-3+4*atan2(2*5+3,3*2+1)+3*2';
	var res = polnishCalc(
		shuntingYard(
			tokenizer(s)
		)
	);
	*/
});