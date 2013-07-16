var webCalc = (function() {
	var gridDimX;
	var gridDimY;
	var createGrid = function(dimX, dimY, grid) {
		gridDimX = dimX;
		gridDimY = dimY;
		
		var html = '';
		
		for (var y = -1; y < dimY; y++) {
			html += '<div class="row">';
			
			for (var x = -1; x < dimX; x++) {
				var col = '';
				if (x >= 0) {
					var xTmp = x;
					do {
						if (xTmp >= 26) {
							col = col + 'A';
							xTmp = xTmp - 26;
							
							if (xTmp == 0) {
								col = col + 'A';
							}
						} else {
							col = col + String.fromCharCode(97 + xTmp).toUpperCase();
							xTmp = 0;
						}
					} while(xTmp > 0);
				}
				
				if (y >= 0) {
					if (x >= 0) {
						html += '<div class="cell" id="'+ ((col.toLowerCase()) + (y+1)) +'"><input type="hidden" /></div>';
					} else {
						html += '<div class="cell webCalcDescr">' + (y+1) + '</div>';
					}
				} else {
					if (x >= 0) {
						html += '<div class="cell webCalcDescr">' + col + '</div>';
					} else {
						html += '<div class="cell" style="background-color: #CCCCCC"></div>';
					}
				}
			}
			
			html += '</div>';
		}
		
		return html;
	};
	
	var setup = function(sel, dx, dy) {
		parser.grammar['VARIABLE'].fnc = function(a) {
			var el = $(a.substring(2, a.length - 1) + '> span');
			var val = el.html();
			
			if (parser.grammar['NUMERIC'].isNumber(val)) {
				return parseFloat(val);
			} else {
				return 0;
			}
		};
			
		$(sel).html(createGrid(dx, dy));
	
		$(sel).on('click', function(e) {
			var el = $(e.target);
		
			if (el.prop('tagName') != 'DIV' || typeof el.attr('id') == 'undefined') {
				return;
			}
		
			var old = el.find('input');
			el.empty();
			el.append('<input type="hidden" value="' + old.val() + '"><input id="newInput"></input>');

			var input = $('#newInput');
			input.val(old.val());
			input.focus();
			
			input.on('keyup', function(e) {
				if (e.keyCode == 27) {
					el.empty();
					el.append('<input type="hidden" value="' + old.val() + '">');
					
					input.off();
				}
			});
			
			input.on('blur change', function(e) {
				var val = $(e.target).val();
				
				old.val(val.replace(/"/g, '&#34;').replace(/'/g, '&#39;'));
				
				el.empty();
				el.append('<input type="hidden" value="' + old.val() + '">' + (val == '' ? '' : '<span>' + val + '</span>'));
				
				var axQueue = new Queue();
				var axCalc = [];
				$(sel).find('div input').each(function() {
					var self = $(this);
					var val = self.val();
					
					if (val.trim().charAt(0) == '=') {
						var calc = val.trim().substring(1);
						var axDep = parser.getDependencies(calc);
						
						if (axDep.length == 0) {
							self.siblings('span').html(parser.parse(calc));
							axCalc.push($(this).parent('div')[0]);
						} else {
							axQueue.enqueue({
								calc: calc,
								dep: axDep,
								obj: $(this)
							});
						}
					}
				});
				
				// RESOLVE DEPENDENCIES
				var count = axQueue.getLength();
				while (axQueue.getLength() > 0) {
					var xCalc = axQueue.dequeue();
					
					var allKnown = true;
					for (var i = 0; i < xCalc.dep.length; i++) {
						var xDep = $(xCalc.dep[i])[0];
						
						var depKnown = false;
						for (var j = 0; j < axCalc.length; j++) {
							if (xDep == axCalc[j]) {
								depKnown = true;
								break;
							}
						}
						
						if (!depKnown) {
							allKnown = false;
							break;
						}
					}
					
					if (allKnown) {
						xCalc.obj.siblings('span').html(parser.parse(xCalc.calc));
						axCalc.push(xCalc.obj.parent('div')[0]);
						
						count = axQueue.getLength();
					} else {
						axQueue.enqueue(xCalc);
						count--;
					}
					
					if (count < 0) {
						throw('Unknown or circular dependency detected');
					}
				}
				
				input.off();
			});
		});
	}
	
	return {
		init: setup
	}
})();