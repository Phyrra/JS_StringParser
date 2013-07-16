var calculator = function(divId) {
	var axButton = [
		[
			{
				disp: ''
			},
			{
				disp: ''
			},
			{
				disp: ''
			},
			{
				disp: 'x!',
				fnc: function() {
					if (!$('#calc_input').val()) {
						$('#calc_input').val($('#calc_input').val() + '0')
					}
					
					$('#calc_input').val($('#calc_input').val() + '!');
				}
			},
			{
				disp: '(',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '(');
				}
			},
			{
				disp: ')',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + ')');
				}
			},
			{
				disp: 'CE',
				fnc: function() {
					$('#calc_input').val('');
				}
			}
		],
		[
			{
				disp: 'PI',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + 'pi');
				}
			},
			{
				disp: 'sin',
				alt: 'asin',
				fnc: function() {
					var self = $(this);
					
					$('#calc_input').val($('#calc_input').val() + self.html() + '(');
				}
			},
			{
				disp: 'ln',
				alt: 'log',
				fnc: function() {
					var self = $(this);
					
					$('#calc_input').val($('#calc_input').val() + self.html() + '(');
				}
			},
			{
				disp: '1',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '1');
				}
			},
			{
				disp: '2',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '2');
				}
			},
			{
				disp: '3',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '3');
				}
			},
			{
				disp: '*',
				fnc: function() {
					if (!$('#calc_input').val()) {
						$('#calc_input').val($('#calc_input').val() + '0')
					}
					
					$('#calc_input').val($('#calc_input').val() + '*');
				}
			}
		],
		[
			{
				disp: 'e',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + 'e');
				}
			},
			{
				disp: 'cos',
				alt: 'acos',
				fnc: function() {
					var self = $(this);
					
					$('#calc_input').val($('#calc_input').val() + self.html() + '(');
				}
			},
			{
				disp: 'sqrt',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + 'sqrt(');
				}
			},
			{
				disp: '4',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '4');
				}
			},
			{
				disp: '5',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '5');
				}
			},
			{
				disp: '6',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '6');
				}
			},
			{
				disp: '/',
				fnc: function() {
					if (!$('#calc_input').val()) {
						$('#calc_input').val($('#calc_input').val() + '0')
					}
					
					$('#calc_input').val($('#calc_input').val() + '/');
				}
			}
		],
		[
			{
				disp: ''
			},
			{
				disp: 'tan',
				alt: 'atan',
				fnc: function() {
					var self = $(this);
					
					$('#calc_input').val($('#calc_input').val() + self.html() + '(');
				}
			},
			{
				disp: '^',
				fnc: function() {
					if (!$('#calc_input').val()) {
						$('#calc_input').val($('#calc_input').val() + '0')
					}
							
							$('#calc_input').val($('#calc_input').val() + '^');
						}
					},
					{
						disp: '7',
						fnc: function() {
							$('#calc_input').val($('#calc_input').val() + '7');
						}
					},
			{
				disp: '8',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '8');
				}
			},
			{
				disp: '9',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '9');
				}
			},
			{
				disp: '+',
				fnc: function() {
					if (!$('#calc_input').val()) {
						$('#calc_input').val($('#calc_input').val() + '0')
					}
					
					$('#calc_input').val($('#calc_input').val() + '+');
				}
			}
		],
		[
			{
				disp: '2nd',
				fnc: function() {
					var self = $(this);
					var main = self.closest('div.calc');
					
					for (var i = 0; i < axButton.length; i++) {
						var axRow = axButton[i];
						
						for (var j = 0; j < axRow.length; j++) {
							if (typeof axRow[j].alt != 'undefined') {
								var button = $($(main.find('div.row')[i]).find('div.cell')[j]).children('div.button');
								
								if (button.html() == axRow[j].alt) {
									button.html(axRow[j].disp);
								} else {
									button.html(axRow[j].alt);
								}
							}
						}
					}
				}
			},
			{
				disp: ''
			},
			{
				disp: ''
			},
			{
				disp: '0',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '0');
				}
			},
			{
				disp: '.',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '.');
				}
			},
			{
				disp: '=',
				fnc: function() {
					var calc = $('#calc_input').val();
					$('#calc_tmp').html(calc);
					
					$('#calc_input').val(parser(calc));
				}
			},
			{
				disp: '-',
				fnc: function() {
					$('#calc_input').val($('#calc_input').val() + '-');
				}
				}
		]
	];
	
	// BUILD
	
	var main = $('#' + divId);

	main.addClass('calc');

	main.append('<div id="calc_tmp"></div>');
	main.append('<input type="text" id="calc_input"></input>')
	
	for (var i = 0; i < axButton.length; i++) {
		var axRow = axButton[i];
		
		var row = $('<div class="row"></div>');
		main.append(row);
		
		for (var j = 0; j < axRow.length; j++) {
			var xButton = axRow[j];
			
			if (xButton.disp != '') {
				row.append('<div class="cell"><div class="button">' + xButton.disp + '</div></div>');
				
				var button = row.find('div.button').last();
				button.on('click', xButton.fnc);
			} else {
				row.append('<div class="cell"></div>');
			}
		}
	}
};