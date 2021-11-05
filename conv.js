module.exports.conv = function (input) {	
	
	// Проверка на не число
	if ((String(parseFloat(input, 10)) != String(input)) && (parseFloat(input, 10) != 0))
		return '0 11111111 10000000000000000000000';
	
	let signBit = 0;
	if (input[0] == '-') {
		signBit = 1;
		input = input.substring(1);
	}
	
	let binNumber = parseFloat(input, 10).toString(2);          // Перевод числа в двоичную систему счисления
	let pointIndex = binNumber.indexOf('.');
	let degree = 0;                                             // Порядок числа
	
	if (pointIndex == 1 && binNumber[0] == '0') {                          // Число вида 0.*
		let oneIndex = binNumber.substring(2).indexOf('1');
		// Степень -127 будет соответствовать денормализованному числу (чтобы позже при сложении с 127 получилось 0) 
		degree = Math.max(-1 * (oneIndex + 1), -127);         
		// Удаление первых нулей (не более 126), встретившихся после точки:
		binNumber = binNumber.substring(-1 * Math.max(degree, -126) + 2);    
	} else if (pointIndex != -1){                     // Число вида 1*.?*
		degree = pointIndex - 1;
		binNumber = binNumber.substring(1, pointIndex) + binNumber.substring(pointIndex + 1);  // Удаление "мнимой" единицы и точки из строки
	} else {                        // Целые числа
		
		if (binNumber == '0')
			degree = -127;
		else {
			degree = binNumber.length - 1;
			binNumber = binNumber.substring(1); // Удаление "мнимой" единицы из строки
		}
	}
	
	let mantissa;
	if (degree > 127) {                 // Infinity
		mantissa = '0'.repeat(23);
		degree = 128;
	}
	else 
		mantissa = binNumber.substring(0, 23);
	degree += 127;
	
	//Добавление незначащих нулей
	mantissa = mantissa + '0'.repeat(23 - mantissa.length);
	degree = '0'.repeat(8 - degree.toString(2).length) + degree.toString(2);
	
	return `${signBit} ${degree} ${mantissa}`;
}

